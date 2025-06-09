import React, { useEffect, useState } from 'react'
import { Trash2, Map, User, Trophy, Search, Plus, AlertCircle, X, Edit2, CheckCircle, Hash } from 'lucide-react'
import { fetchRaces, createRace, updateRace, deleteRace, Race } from '../api/racesApi'
import { Director, fetchDirectors } from '~/api/directorApi'
import { fetchSponsors, Sponsor } from '~/api/sponsorApi'
import { fetchLicenses, License } from '~/api/licenseApi'

export default function RaceList() {
  const [races, setRaces] = useState<Race[]>([])
  const [directors, setDirectors] = useState<Director[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false)
  const [raceToDelete, setRaceToDelete] = useState<{ rno: number; licNo: string } | null>(null)
  const [newRace, setNewRace] = useState<Race>({ rno: 0, licNo: '', dir: '', malWin: null, femWin: null, spName: '' })
  const [editRace, setEditRace] = useState<Race | null>(null)
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const PAGE_SIZE = 10

  // Validate race fields
  const validateRace = (race: Race): string | null => {
    if (race.rno <= 0) return 'Mã cuộc đua phải là số dương'
    if (!race.licNo.trim()) return 'Mã giấy phép không được để trống'
    if (!/^[a-zA-Z0-9_-]+$/.test(race.licNo)) return 'Mã giấy phép chỉ được chứa chữ, số, dấu gạch dưới hoặc gạch ngang'
    if (!race.dir.trim()) return 'Giám đốc không được để trống'
    if (!race.spName.trim()) return 'Nhà tài trợ không được để trống'
    return null
  }

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [racesData, directorsData, sponsorsData, licensesData] = await Promise.all([
          fetchRaces(),
          fetchDirectors(),
          fetchSponsors(),
          fetchLicenses()
        ])
        setRaces(Array.isArray(racesData) ? racesData : [])
        setDirectors(Array.isArray(directorsData) ? directorsData : [])
        setSponsors(Array.isArray(sponsorsData) ? sponsorsData : [])
        setLicenses(Array.isArray(licensesData) ? licensesData : [])
        setLoading(false)
      } catch (err: any) {
        console.error('Error loading data:', err)
        setError(err.message || 'Không thể tải dữ liệu')
        setRaces([])
        setDirectors([])
        setSponsors([])
        setLicenses([])
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  // Create race
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateRace(newRace)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      const race = await createRace(newRace)
      setRaces((prev) => [...prev, race])
      setIsAddModalOpen(false)
      setNewRace({ rno: 0, licNo: '', dir: '', malWin: null, femWin: null, spName: '' })
      showNotification('Thêm cuộc đua thành công!')
    } catch (err: any) {
      console.error('Error creating race:', err)
      setError(err.message || 'Không thể thêm cuộc đua')
    }
  }

  // Update race
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRace) {
      setError('Không có dữ liệu cuộc đua để sửa')
      return
    }
    const validationError = validateRace(editRace)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      console.log('Editing race:', editRace) // Debug log
      const updatedRace = await updateRace(editRace.rno, editRace.licNo, editRace)
      setRaces((prev) => prev.map((r) => (r.rno === editRace.rno && r.licNo === editRace.licNo ? updatedRace : r)))
      setIsEditModalOpen(false)
      setEditRace(null)
      showNotification('Sửa cuộc đua thành công!')
    } catch (err: any) {
      console.error('Error updating race:', err)
      setError(err.message || 'Không thể sửa cuộc đua')
    }
  }

  // Open delete confirmation
  const openDeleteConfirm = (rno: number, licNo: string) => {
    setRaceToDelete({ rno, licNo })
    setIsDeleteConfirmOpen(true)
  }

  // Delete race
  const handleDelete = async () => {
    if (!raceToDelete) return
    setDeleteLoading(`${raceToDelete.rno}-${raceToDelete.licNo}`)
    try {
      await deleteRace(raceToDelete.rno, raceToDelete.licNo)
      setRaces((prev) => prev.filter((r) => r.rno !== raceToDelete.rno || r.licNo !== raceToDelete.licNo))
      setIsDeleteConfirmOpen(false)
      setRaceToDelete(null)
      showNotification('Xóa cuộc đua thành công!')
    } catch (err: any) {
      console.error('Error deleting race:', err)
      setError(err.message || 'Không thể xóa cuộc đua')
    } finally {
      setDeleteLoading(null)
    }
  }

  // Open edit modal
  const openEditModal = (race: Race) => {
    setEditRace(race)
    setIsEditModalOpen(true)
  }

  // Search races
  const filteredRaces = races.filter((race) => {
    const rnoString = race.rno != null ? race.rno.toString() : ''
    const licNo = race.licNo || ''
    const dir = race.dir || ''
    const spName = race.spName || ''
    const malWin = race.malWin || ''
    const femWin = race.femWin || ''
    return (
      rnoString.includes(searchTerm) ||
      licNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dir.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      malWin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      femWin.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredRaces.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const paginatedRaces = filteredRaces.slice(startIndex, endIndex)

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

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Xác nhận xóa</h2>
                <button onClick={() => setIsDeleteConfirmOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <p className='text-gray-700 mb-6'>
                Bạn có chắc chắn muốn xóa cuộc đua với mã {raceToDelete?.rno} và mã giấy phép {raceToDelete?.licNo}?
              </p>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
                >
                  Hủy
                </button>
                <button onClick={handleDelete} className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg'>
                <Map className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Danh sách cuộc đua</h1>
                <p className='text-gray-600 mt-1'>Quản lý thông tin các cuộc đua</p>
              </div>
            </div>
            <button
              className='flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg'
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className='w-4 h-4' />
              Thêm cuộc đua
            </button>
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Thêm cuộc đua mới</h2>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleCreate} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mã cuộc đua</label>
                  <input
                    type='number'
                    value={newRace.rno || ''}
                    onChange={(e) => setNewRace({ ...newRace, rno: parseInt(e.target.value) || 0 })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                    min='1'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mã giấy phép</label>
                  <select
                    value={newRace.licNo}
                    onChange={(e) => setNewRace({ ...newRace, licNo: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Chọn mã giấy phép</option>
                    {licenses.map((license) => (
                      <option key={license.licNo} value={license.licNo}>
                        {license.licNo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Giám đốc</label>
                  <select
                    value={newRace.dir}
                    onChange={(e) => setNewRace({ ...newRace, dir: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Chọn giám đốc</option>
                    {directors.map((director) => (
                      <option key={director.name} value={director.name}>
                        {director.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Nhà tài trợ</label>
                  <select
                    value={newRace.spName}
                    onChange={(e) => setNewRace({ ...newRace, spName: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Chọn nhà tài trợ</option>
                    {sponsors.map((sponsor) => (
                      <option key={sponsor.spName} value={sponsor.spName}>
                        {sponsor.spName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Người thắng nam</label>
                  <input
                    type='text'
                    value={newRace.malWin || ''}
                    onChange={(e) => setNewRace({ ...newRace, malWin: e.target.value || null })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Người thắng nữ</label>
                  <input
                    type='text'
                    value={newRace.femWin || ''}
                    onChange={(e) => setNewRace({ ...newRace, femWin: e.target.value || null })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
        {isEditModalOpen && editRace && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-900'>Sửa thông tin cuộc đua</h2>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <form onSubmit={handleEdit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mã cuộc đua</label>
                  <input
                    type='number'
                    value={editRace.rno}
                    disabled
                    className='w-full p-2 border border-gray-300 rounded-lg bg-gray-100'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mã giấy phép</label>
                  <input
                    type='text'
                    value={editRace.licNo}
                    disabled
                    className='w-full p-2 border border-gray-300 rounded-lg bg-gray-100'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Giám đốc</label>
                  <select
                    value={editRace.dir}
                    onChange={(e) => setEditRace({ ...editRace, dir: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Chọn giám đốc</option>
                    {directors.map((director) => (
                      <option key={director.name} value={director.name}>
                        {director.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Nhà tài trợ</label>
                  <select
                    value={editRace.spName}
                    onChange={(e) => setEditRace({ ...editRace, spName: e.target.value })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Chọn nhà tài trợ</option>
                    {sponsors.map((sponsor) => (
                      <option key={sponsor.spName} value={sponsor.spName}>
                        {sponsor.spName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Người thắng nam</label>
                  <input
                    type='text'
                    value={editRace.malWin || ''}
                    onChange={(e) => setEditRace({ ...editRace, malWin: e.target.value || null })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Người thắng nữ</label>
                  <input
                    type='text'
                    value={editRace.femWin || ''}
                    onChange={(e) => setEditRace({ ...editRace, femWin: e.target.value || null })}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                placeholder='Tìm kiếm theo mã, giám đốc, nhà tài trợ, người thắng...'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
              <AlertCircle className='w-4 h-4' />
              Tổng số: <span className='font-semibold text-blue-600'>{filteredRaces.length}</span> cuộc đua
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          {paginatedRaces.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto'>
                <Map className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có cuộc đua'}
              </h3>
              <p className='text-gray-500'>
                {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm cuộc đua đầu tiên hoặc kiểm tra kết nối API.'}
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <Hash className='w-4 h-4' />
                        Mã cuộc đua
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <Hash className='w-4 h-4' />
                        Mã giấy phép
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <User className='w-4 h-4' />
                        Giám đốc
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <Trophy className='w-4 h-4' />
                        Người thắng nam
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <Trophy className='w-4 h-4' />
                        Người thắng nữ
                      </div>
                    </th>
                    <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      <div className='flex items-center gap-2'>
                        <User className='w-4 h-4' />
                        Nhà tài trợ
                      </div>
                    </th>
                    <th className='text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {paginatedRaces.map((race, index) => (
                    <tr key={`${race.rno}-${race.licNo}`} className='hover:bg-gray-50 transition-colors duration-150'>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                            {race.rno}
                          </div>
                          <div>
                            <div className='font-medium text-gray-900'>{race.rno}</div>
                            <div className='text-sm text-gray-500'>Cuộc đua #{startIndex + index + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {race.licNo}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-gray-900'>{race.dir}</div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-gray-900'>{race.malWin || '-'}</div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-gray-900'>{race.femWin || '-'}</div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-gray-900'>{race.spName}</div>
                      </td>
                      <td className='py-4 px-6 text-center'>
                        <div className='flex justify-center gap-2'>
                          <button
                            onClick={() => openEditModal(race)}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200'
                          >
                            <Edit2 className='w-4 h-4' />
                            Sửa
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(race.rno, race.licNo)}
                            disabled={deleteLoading === `${race.rno}-${race.licNo}`}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {deleteLoading === `${race.rno}-${race.licNo}` ? (
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
        <div className='mt-6 text-center text-sm text-gray-500'>© 2025 Hệ thống quản lý cuộc đua</div>
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
