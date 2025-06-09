import axios, { AxiosError } from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/sponsors`

export interface Sponsor {
  spName: string
  contact: string
}

export const fetchSponsors = async (): Promise<Sponsor[]> => {
  try {
    const response = await axios.get<Sponsor[]>(API_URL)
    const data = response.data
    console.log('fetchSponsors: Raw API response:', data)
    if (!Array.isArray(data)) {
      console.warn('fetchSponsors: Response is not an array:', data)
      return []
    }
    const validSponsors = data.filter(
      (sponsor): sponsor is Sponsor =>
        sponsor != null && typeof sponsor.spName === 'string' && typeof sponsor.contact === 'string'
    )
    console.log('fetchSponsors: Valid sponsors:', validSponsors)
    return validSponsors
  } catch (error) {
    console.error('fetchSponsors: Error fetching sponsors:', error)
    throw new Error('Không thể tải danh sách nhà tài trợ')
  }
}

export const fetchSponsorById = async (spName: string): Promise<Sponsor | null> => {
  try {
    const response = await axios.get<Sponsor>(`${API_URL}/${spName}`)
    console.log('fetchSponsorById: Fetched sponsor:', response.data)
    return response.data
  } catch (error) {
    console.error('fetchSponsorById: Error fetching sponsor:', error)
    return null
  }
}

export const createSponsor = async (sponsor: Sponsor): Promise<Sponsor> => {
  try {
    const response = await axios.post<Sponsor>(API_URL, sponsor, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('createSponsor: Created sponsor:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('createSponsor: Error creating sponsor:', axiosError)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng (415). Vui lòng kiểm tra lại.'
        : axiosError.response?.data?.message || 'Không thể thêm nhà tài trợ'
    )
  }
}

export const updateSponsor = async (spName: string, sponsor: Sponsor): Promise<Sponsor> => {
  try {
    const response = await axios.put<Sponsor>(`${API_URL}/${spName}`, sponsor, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('updateSponsor: Updated sponsor:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('updateSponsor: Error updating sponsor:', axiosError)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng (415). Vui lòng kiểm tra lại.'
        : axiosError.response?.data?.message || 'Không thể sửa nhà tài trợ'
    )
  }
}

export const deleteSponsor = async (spName: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${spName}`)
    console.log('deleteSponsor: Deleted sponsor:', spName)
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('deleteSponsor: Error deleting sponsor:', axiosError)
    throw new Error(axiosError.response?.data?.message || 'Không thể xóa nhà tài trợ')
  }
}
