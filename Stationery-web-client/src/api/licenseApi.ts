import axios, { AxiosError } from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/licenses`

export interface License {
  licNo: string
  city: string
  date: string // ISO date string (e.g., "2025-06-09")
  issues: string
  cost: number
  dept: string
  contact: string
}

export const fetchLicenses = async (): Promise<License[]> => {
  try {
    const response = await axios.get<License[]>(API_URL)
    const data = response.data
    console.log('fetchLicenses: Raw API response:', data)
    if (!Array.isArray(data)) {
      console.warn('fetchLicenses: Response is not an array:', data)
      return []
    }
    const validLicenses = data.filter(
      (license): license is License =>
        license != null &&
        typeof license.licNo === 'string' &&
        typeof license.city === 'string' &&
        typeof license.date === 'string' &&
        typeof license.issues === 'string' &&
        typeof license.cost === 'number' &&
        typeof license.dept === 'string' &&
        typeof license.contact === 'string'
    )
    console.log('fetchLicenses: Valid licenses:', validLicenses)
    return validLicenses
  } catch (error) {
    console.error('fetchLicenses: Error fetching licenses:', error)
    throw new Error('Không thể tải danh sách giấy phép')
  }
}

export const fetchLicenseById = async (licNo: string): Promise<License | null> => {
  try {
    const response = await axios.get<License>(`${API_URL}/${licNo}`)
    console.log('fetchLicenseById: Fetched license:', response.data)
    return response.data
  } catch (error) {
    console.error('fetchLicenseById: Error fetching license:', error)
    return null
  }
}

export const createLicense = async (license: License): Promise<License> => {
  try {
    const response = await axios.post<License>(API_URL, license, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('createLicense: Created license:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('createLicense: Error creating license:', axiosError)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng (415). Vui lòng kiểm tra lại.'
        : axiosError.response?.data?.message || 'Không thể thêm giấy phép'
    )
  }
}

export const updateLicense = async (licNo: string, license: License): Promise<License> => {
  try {
    const response = await axios.put<License>(`${API_URL}/${licNo}`, license, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('updateLicense: Updated license:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('updateLicense: Error updating license:', axiosError)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng (415). Vui lòng kiểm tra lại.'
        : axiosError.response?.data?.message || 'Không thể sửa giấy phép'
    )
  }
}

export const deleteLicense = async (licNo: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${licNo}`)
    console.log('deleteLicense: Deleted license:', licNo)
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('deleteLicense: Error deleting license:', axiosError)
    throw new Error(axiosError.response?.data?.message || 'Không thể xóa giấy phép')
  }
}
