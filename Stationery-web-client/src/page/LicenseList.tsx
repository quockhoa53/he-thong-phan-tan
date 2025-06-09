import React, { useEffect, useState } from 'react'
import { Trash2, FileText, Search, Plus, AlertCircle, X, Edit2, CheckCircle } from 'lucide-react'
import { fetchLicenses, createLicense, updateLicense, deleteLicense, License } from '../api/licenseApi'

export default function LicenseList() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [newLicense, setNewLicense] = useState<License>({
    licNo: '',
    city: '',
    date: '',
    issues: '',
    cost: 0,
    dept: '',
    contact: ''
  })
  const [editLicense, setEditLicense] = useState<License | null>(null)
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

  // Validate inputs
  const validateLicense = (license: License): string | null => {
    if (!license.licNo.trim()) return 'Mã giấy phép không được để trống'
    if (!license.city.trim()) return 'Thành phố không được để trống'
    if (!license.date || !/^\d{4}-\d{2}-\d{2}$/.test(license.date)) return 'Ngày cấp phải có định dạng YYYY-MM-DD'
    if (!license.issues.trim()) return 'Vấn đề không được để trống'
    if (license.cost <= 0) return 'Chi phí phải là số dương'
    if (!license.dept.trim()) return 'Phòng ban không được để trống'
    if (!license.contact.trim()) return 'Thông tin liên hệ không được để trống'
    return null
  }

  // Fetch licenses
  useEffect(() => {
    const loadLicenses = async () => {
      try {
        const data = await fetchLicenses()
        console.log('loadLicenses: Fetched licenses:', data)
        setLicenses(data)
        setLoading(false)
      } catch (err: any) {
        console.error('loadLicenses: Error fetching licenses:', err)
        setError(err.message || 'Không thể tải danh sách giấy phép')
        setLicenses([])
        setLoading(false)
      }
    }
    loadLicenses()
  }, [])

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  // Create license
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateLicense(newLicense)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      const license = await createLicense(newLicense)
      setLicenses((prev) => [...prev, license])
      setIsAddModalOpen(false)
      setNewLicense({ licNo: '', city: '', date: '', issues: '', cost: 0, dept: '', contact: '' })
      showNotification('Thêm giấy phép thành công!')
    } catch (err: any) {
      console.error('Error creating license:', err)
      setError(err.message)
    }
  }

  // Update license
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editLicense) return
    const validationError = validateLicense(editLicense)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      const updatedLicense = await updateLicense(editLicense.licNo, editLicense)
      setLicenses((prev) => prev.map((l) => (l.licNo === editLicense.licNo ? updatedLicense : l)))
      setIsEditModalOpen(false)
      setEditLicense(null)
      showNotification('Sửa giấy phép thành công!')
    } catch (err: any) {
      console.error('Error updating license:', err)
      setError(err.message)
    }
  }

  // Delete license
  const handleDelete = async (licNo: string) => {
    setDeleteLoading(licNo)
    try {
      await deleteLicense(licNo)
      setLicenses((prev) => prev.filter((l) => l.licNo !== licNo))
      showNotification('Xóa giấy phép thành công!')
    } catch (err: any) {
      console.error('Error deleting license:', err)
      setError(err.message)
    } finally {
      setDeleteLoading(null)
    }
  }

  // Open edit modal
  const openEditModal = (license: License) => {
    setEditLicense(license)
    setIsEditModalOpen(true)
  }

  // Search licenses
  const filteredLicenses = licenses.filter(
    (license) =>
      license.licNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.issues.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredLicenses.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const paginatedLicenses = filteredLicenses.slice(startIndex, endIndex)

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
                <FileText className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Danh sách giấy phép</h1>
                <p className='text-gray-600 mt-1'>Quản lý thông tin các giấy phép</p>
              </div>
            </div>
            <button
              className='flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg'
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className='w-4 h-4' />
              Thêm giấy phép
            </button>
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Thêm giấy phép mới</h2>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleCreate} className='space-y-4'>
                <div>
                  <label className recalled='block text-sm font-medium text-gray-700'>
                    Mã giấy phép
                  </label>
                  <input
                    type='text'
                    value={newLicense.licNo}
                    onChange={(e) => setNewLicense({ ...newLicense, licNo: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Thành phố</label>
                  <input
                    type='text'
                    value={newLicense.city}
                    onChange={(e) => setNewLicense({ ...newLicense, city: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Ngày cấp (YYYY-MM-DD)</label>
                  <input
                    type='date'
                    value={newLicense.date}
                    onChange={(e) => setNewLicense({ ...newLicense, date: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Vấn đề</label>
                  <input
                    type='text'
                    value={newLicense.issues}
                    onChange={(e) => setNewLicense({ ...newLicense, issues: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Chi phí</label>
                  <input
                    type='number'
                    value={newLicense.cost}
                    onChange={(e) => setNewLicense({ ...newLicense, cost: parseFloat(e.target.value) || 0 })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                    min='0'
                    step='0.01'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Phòng ban</label>
                  <input
                    type='text'
                    value={newLicense.dept}
                    onChange={(e) => setNewLicense({ ...newLicense, dept: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Thông tin liên hệ</label>
                  <input
                    type='text'
                    value={newLicense.contact}
                    onChange={(e) => setNewLicense({ ...newLicense, contact: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
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
        {isEditModalOpen && editLicense && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Sửa thông tin giấy phép</h2>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleEdit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mã giấy phép</label>
                  <input
                    type='text'
                    value={editLicense.licNo}
                    disabled
                    className='w-full p-2 border border-gray-200 rounded-lg bg-gray-100'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Thành phố</label>
                  <input
                    type='text'
                    value={editLicense.city}
                    onChange={(e) => setEditLicense({ ...editLicense, city: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Ngày cấp (YYYY-MM-DD)</label>
                  <input
                    type='date'
                    value={editLicense.date}
                    onChange={(e) => setEditLicense({ ...editLicense, date: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Vấn đề</label>
                  <input
                    type='text'
                    value={editLicense.issues}
                    onChange={(e) => setEditLicense({ ...editLicense, issues: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Chi phí</label>
                  <input
                    type='number'
                    value={editLicense.cost}
                    onChange={(e) => setEditLicense({ ...editLicense, cost: parseFloat(e.target.value) || 0 })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                    min='0'
                    step='0.01'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Phòng ban</label>
                  <input
                    type='text'
                    value={editLicense.dept}
                    onChange={(e) => setEditLicense({ ...editLicense, dept: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Thông tin liên hệ</label>
                  <input
                    type='text'
                    value={editLicense.contact}
                    onChange={(e) => setEditLicense({ ...editLicense, contact: e.target.value })}
                    className='w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
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
                placeholder='Tìm kiếm theo mã, thành phố, vấn đề, phòng ban hoặc liên hệ...'
                className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
              <AlertCircle className='w-4 h-4' />
              Tổng số: <span className='font-semibold text-blue-600'>{filteredLicenses.length}</span> giấy phép
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          {paginatedLicenses.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto'>
                <FileText className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có giấy phép'}
              </h3>
              <p className='text-gray-500'>
                {searchTerm
                  ? 'Thử thay đổi từ khóa tìm kiếm'
                  : 'Hãy thêm giấy phép đầu tiên hoặc kiểm tra kết nối API.'}
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <FileText className='w-4 h-4' />
                        Mã giấy phép
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Thành phố
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Ngày cấp
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Vấn đề
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Chi phí
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Phòng ban
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Liên hệ
                    </th>
                    <th className='text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {paginatedLicenses.map((license, index) => (
                    <tr key={license.licNo} className='hover:bg-gray-50 transition-colors duration-150'>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                            {license.licNo.substring(0, 3)}
                          </div>
                          <div>
                            <div className='font-medium text-gray-900'>{license.licNo}</div>
                            <div className='text-sm text-gray-500'>Giấy phép #{startIndex + index + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-gray-900'>{license.city}</td>
                      <td className='py-4 px-6 text-gray-900'>{license.date}</td>
                      <td className='py-4 px-6 text-gray-900'>{license.issues}</td>
                      <td className='py-4 px-6 text-gray-900'>{license.cost.toFixed(2)}</td>
                      <td className='py-4 px-6 text-gray-900'>{license.dept}</td>
                      <td className='py-4 px-6 text-gray-900'>{license.contact}</td>
                      <td className='py-4 px-6 text-center'>
                        <div className='flex justify-center gap-2'>
                          <button
                            onClick={() => openEditModal(license)}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200'
                          >
                            <Edit2 className='w-4 h-4' />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(license.licNo)}
                            disabled={deleteLoading === license.licNo}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {deleteLoading === license.licNo ? (
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
        <div className='mt-6 text-center text-sm text-gray-500'>© 2025 Hệ thống quản lý giấy phép</div>
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
