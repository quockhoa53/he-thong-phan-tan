import React, { useEffect, useState } from 'react'
import { Trash2, User, MapPin, Hash, Search, Plus, AlertCircle, X, Edit2, CheckCircle } from 'lucide-react'
import { fetchRacers, createRacer, updateRacer, deleteRacer } from '../api/racerApi'

type Racer = {
  memNum: string
  name: string
  address: string
  participates?: any[]
}

type NotificationType = {
  show: boolean
  message: string
  type: 'success' | 'error'
}

export default function RacerList() {
  const [racers, setRacers] = useState<Racer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newRacer, setNewRacer] = useState<Omit<Racer, 'participates'>>({
    name: '',
    address: '',
    memNum: ''
  })
  const [editRacer, setEditRacer] = useState<Racer | null>(null)
  const [notification, setNotification] = useState<NotificationType>({
    show: false,
    message: '',
    type: 'success'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    const loadRacers = async () => {
      try {
        const data = await fetchRacers()
        console.log('Dữ liệu lấy được ' + data)
        setRacers(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching racers:', err)
        setError('Không thể tải danh sách vận động viên')
        setLoading(false)
      }
    }
    loadRacers()
  }, [])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const racer = await createRacer(newRacer)
      setRacers((prev) => [...prev, racer])
      setIsAddModalOpen(false)
      setNewRacer({ name: '', address: '', memNum: '' })
      showNotification('Thêm vận động viên thành công!')
    } catch (err) {
      console.error('Error creating racer:', err)
      showNotification('Không thể thêm vận động viên', 'error')
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRacer) return

    try {
      const updatedRacer = await updateRacer(editRacer.memNum, editRacer)
      setRacers((prev) => prev.map((r) => (r.memNum === editRacer.memNum ? updatedRacer : r)))
      setIsEditModalOpen(false)
      setEditRacer(null)
      showNotification('Sửa vận động viên thành công!')
    } catch (err) {
      console.error('Error updating racer:', err)
      showNotification('Không thể sửa vận động viên', 'error')
    }
  }

  const handleDelete = async (memNum: string) => {
    setDeleteLoading(memNum)
    try {
      await deleteRacer(memNum)
      setRacers((prev) => prev.filter((r) => r.memNum !== memNum))
      showNotification('Xóa vận động viên thành công!')
    } catch (err) {
      console.error('Error deleting racer:', err)
      showNotification('Không thể xóa vận động viên', 'error')
    } finally {
      setDeleteLoading(null)
    }
  }

  const openEditModal = (racer: Racer) => {
    setEditRacer(racer)
    setIsEditModalOpen(true)
  }

  const filteredRacers = racers.filter(
    (racer) =>
      racer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      racer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      racer.memNum.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredRacers.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const paginatedRacers = filteredRacers.slice(startIndex, endIndex)

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
          <div className='bg-red-100 text-red-700 p-4 rounded-lg'>{error}</div>
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
                <User className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Danh sách vận động viên</h1>
                <p className='text-gray-600 mt-1'>Quản lý thông tin các vận động viên</p>
              </div>
            </div>
            <button
              className='flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg'
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className='w-4 h-4' />
              Thêm vận động viên
            </button>
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Thêm vận động viên mới</h2>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleCreate} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Tên</label>
                  <input
                    type='text'
                    value={newRacer.name}
                    onChange={(e) => setNewRacer({ ...newRacer, name: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Địa chỉ</label>
                  <input
                    type='text'
                    value={newRacer.address}
                    onChange={(e) => setNewRacer({ ...newRacer, address: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mã thành viên</label>
                  <input
                    type='text'
                    value={newRacer.memNum}
                    onChange={(e) => setNewRacer({ ...newRacer, memNum: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
        {isEditModalOpen && editRacer && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Sửa thông tin vận động viên</h2>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleEdit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Tên</label>
                  <input
                    type='text'
                    value={editRacer.name}
                    onChange={(e) => setEditRacer({ ...editRacer, name: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Địa chỉ</label>
                  <input
                    type='text'
                    value={editRacer.address}
                    onChange={(e) => setEditRacer({ ...editRacer, address: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mã thành viên</label>
                  <input
                    type='text'
                    value={editRacer.memNum}
                    onChange={(e) => setEditRacer({ ...editRacer, memNum: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                placeholder='Tìm kiếm theo tên, địa chỉ hoặc mã...'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
              <AlertCircle className='w-4 h-4' />
              Tổng số: <span className='font-semibold text-blue-600'>{filteredRacers.length}</span> vận động viên
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
          {paginatedRacers.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <User className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có vận động viên'}
              </h3>
              <p className='text-gray-500'>
                {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm vận động viên đầu tiên'}
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <User className='w-4 h-4' />
                        Tên vận động viên
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='w-4 h-4' />
                        Địa chỉ
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <Hash className='w-4 h-4' />
                        Mã thành viên
                      </div>
                    </th>
                    <th className='text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {paginatedRacers.map((racer, index) => (
                    <tr key={racer.memNum} className='hover:bg-gray-50 transition-colors duration-150'>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                            {racer.name.charAt(0)}
                          </div>
                          <div>
                            <div className='font-medium text-gray-900'>{racer.name}</div>
                            <div className='text-sm text-gray-500'>Vận động viên #{startIndex + index + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-gray-900'>{racer.address}</div>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {racer.memNum}
                        </span>
                      </td>
                      <td className='py-4 px-6 text-center'>
                        <div className='flex justify-center gap-2'>
                          <button
                            onClick={() => openEditModal(racer)}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200'
                          >
                            <Edit2 className='w-4 h-4' />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(racer.memNum)}
                            disabled={deleteLoading === racer.memNum}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {deleteLoading === racer.memNum ? (
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
        <div className='mt-6 text-center text-sm text-gray-500'>© 2025 Hệ thống quản lý vận động viên</div>
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
