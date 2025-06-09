import React, { useEffect, useState } from 'react'
import { Trash2, DollarSign, Search, Plus, AlertCircle, X, Edit2, CheckCircle } from 'lucide-react'
import { fetchSponsors, createSponsor, updateSponsor, deleteSponsor, Sponsor } from '../api/sponsorApi'

export default function SponsorList() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [newSponsor, setNewSponsor] = useState<Sponsor>({ spName: '', contact: '' })
  const [editSponsor, setEditSponsor] = useState<Sponsor | null>(null)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({
    show: false,
    message: '',
    type: 'success'
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const PAGE_SIZE = 10

  // Validate phone number
  const validateContact = (contact: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(contact)
  }

  // Validate sponsor
  const validateSponsor = (sponsor: Sponsor): string | null => {
    if (!sponsor.spName.trim()) return 'Tên nhà tài trợ không được để trống'
    if (!sponsor.contact.trim()) return 'Số liên hệ không được để trống'
    if (!validateContact(sponsor.contact)) return 'Số điện thoại liên hệ không hợp lệ'
    return null
  }

  // Fetch sponsors
  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const data = await fetchSponsors()
        console.log('loadSponsors: Fetched sponsors:', data)
        setSponsors(data)
        setLoading(false)
      } catch (err: any) {
        console.error('loadSponsors: Error fetching sponsors:', err)
        setError(err.message || 'Không thể tải danh sách nhà tài trợ')
        setSponsors([])
        setLoading(false)
      }
    }
    loadSponsors()
  }, [])

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  // Create sponsor
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateSponsor(newSponsor)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      const sponsor = await createSponsor(newSponsor)
      setSponsors((prev) => [...prev, sponsor])
      setIsAddModalOpen(false)
      setNewSponsor({ spName: '', contact: '' })
      showNotification('Thêm nhà tài trợ thành công!')
    } catch (err: any) {
      console.error('Error creating sponsor:', err)
      setError(err.message)
    }
  }

  // Update sponsor
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editSponsor) return
    const validationError = validateSponsor(editSponsor)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      const updatedSponsor = await updateSponsor(editSponsor.spName, editSponsor)
      setSponsors((prev) => prev.map((s) => (s.spName === editSponsor.spName ? updatedSponsor : s)))
      setIsEditModalOpen(false)
      setEditSponsor(null)
      showNotification('Sửa nhà tài trợ thành công!')
    } catch (err: any) {
      console.error('Error updating sponsor:', err)
      setError(err.message)
    }
  }

  // Delete sponsor
  const handleDelete = async (spName: string) => {
    setDeleteLoading(spName)
    try {
      await deleteSponsor(spName)
      setSponsors((prev) => prev.filter((s) => s.spName !== spName))
      showNotification('Xóa nhà tài trợ thành công!')
    } catch (err: any) {
      console.error('Error deleting sponsor:', err)
      setError(err.message)
    } finally {
      setDeleteLoading(null)
    }
  }

  // Open edit modal
  const openEditModal = (sponsor: Sponsor) => {
    setEditSponsor(sponsor)
    setIsEditModalOpen(true)
  }

  // Search sponsors
  const filteredSponsors = sponsors.filter(
    (sponsor) =>
      sponsor.spName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredSponsors.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const paginatedSponsors = filteredSponsors.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-300 rounded w-1/4'></div>
            <div className='h-64 bg-gray-300 rounded'></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='bg-red-100 text-red-700 p-4 rounded-lg flex items-center justify-center gap-2'>
            <AlertCircle className='w-5 h-5' />
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Notification Modal */}
        {notification.show && (
          <div className='fixed top-4 right-4 z-50 animate-slide-in'>
            <div
              className={`flex items-center gap-2 p-4 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              <CheckCircle className='w-5 h-5' />
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                className='ml-auto'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg'>
                <DollarSign className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Danh sách nhà tài trợ</h1>
                <p className='text-gray-600 mt-1'>Quản lý thông tin các nhà tài trợ</p>
              </div>
            </div>
            <button
              className='flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg'
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className='w-4 h-4' />
              Thêm nhà tài trợ
            </button>
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Thêm nhà tài trợ mới</h2>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleCreate} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Tên nhà tài trợ</label>
                  <input
                    type='text'
                    value={newSponsor.spName}
                    onChange={(e) => setNewSponsor({ ...newSponsor, spName: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Số liên hệ</label>
                  <input
                    type='text'
                    value={newSponsor.contact}
                    onChange={(e) => setNewSponsor({ ...newSponsor, contact: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                  {!validateContact(newSponsor.contact) && newSponsor.contact && (
                    <p className='text-red-500 text-sm mt-1'>Số điện thoại không hợp lệ. Vui lòng nhập số hợp lệ.</p>
                  )}
                </div>
                <div className='flex justify-end gap-2'>
                  <button
                    type='button'
                    onClick={() => setIsAddModalOpen(false)}
                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
                  >
                    Hủy
                  </button>
                  <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editSponsor && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Sửa thông tin nhà tài trợ</h2>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleEdit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Tên nhà tài trợ</label>
                  <input
                    type='text'
                    value={editSponsor.spName}
                    disabled
                    className='w-full p-2 border border-gray-200 rounded-lg bg-gray-100'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Số liên hệ</label>
                  <input
                    type='text'
                    value={editSponsor.contact}
                    onChange={(e) => setEditSponsor({ ...editSponsor, contact: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                  {!validateContact(editSponsor.contact) && editSponsor.contact && (
                    <p className='text-red-500 text-sm mt-1'>Số điện thoại không hợp lệ. Vui lòng nhập số hợp lệ.</p>
                  )}
                </div>
                <div className='flex justify-end gap-2'>
                  <button
                    type='button'
                    onClick={() => setIsEditModalOpen(false)}
                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
                  >
                    Hủy
                  </button>
                  <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Stats */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200'>
          <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Tìm kiếm theo tên hoặc số liên hệ...'
                className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
              <AlertCircle className='w-4 h-4' />
              Tổng số: <span className='font-semibold text-blue-600'>{filteredSponsors.length}</span> nhà tài trợ
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          {paginatedSponsors.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto'>
                <DollarSign className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có nhà tài trợ'}
              </h3>
              <p className='text-gray-500'>
                {searchTerm
                  ? 'Thử thay đổi từ khóa tìm kiếm'
                  : 'Hãy thêm nhà tài trợ đầu tiên hoặc kiểm tra kết nối API.'}
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <DollarSign className='w-4 h-4' />
                        Tên nhà tài trợ
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Số liên hệ
                    </th>
                    <th className='text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {paginatedSponsors.map((sponsor, index) => (
                    <tr key={sponsor.spName} className='hover:bg-gray-50 transition-colors duration-150'>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                            {sponsor.spName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className='font-medium text-gray-900'>{sponsor.spName}</div>
                            <div className='text-sm text-gray-500'>Nhà tài trợ #{startIndex + index + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-gray-900'>{sponsor.contact}</td>
                      <td className='py-4 px-6 text-center'>
                        <div className='flex justify-center gap-2'>
                          <button
                            onClick={() => openEditModal(sponsor)}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200'
                          >
                            <Edit2 className='w-4 h-4' />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(sponsor.spName)}
                            disabled={deleteLoading === sponsor.spName}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {deleteLoading === sponsor.spName ? (
                              <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                            ) : (
                              <Trash2 className='w-4 h-4' />
                            )}
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-6 flex justify-center items-center gap-2'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        )}

        {/* Footer */}
        <div className='mt-6 text-center text-sm text-gray-500'>© 2025 Hệ thống quản lý nhà tài trợ</div>
      </div>

      {/* Tailwind Animation for Notification */}
      <style>
        {`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}
      </style>
    </div>
  )
}
