import axios, { AxiosError } from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/participates`

export interface Participates {
  memNum: string
  rno: number
  licNo: string
}

export const fetchParticipates = async (): Promise<Participates[]> => {
  try {
    const response = await axios.get<Participates[]>(API_URL)
    const data = response.data
    console.log('fetchParticipates: Raw API response:', data)

    if (!Array.isArray(data)) {
      console.warn('fetchParticipates: Response is not an array:', data)
      return []
    }

    const validParticipates = data.filter(
      (p): p is Participates =>
        p != null && typeof p.memNum === 'string' && typeof p.rno === 'number' && typeof p.licNo === 'string'
    )
    console.log('fetchParticipates: Valid participates:', validParticipates)
    return validParticipates
  } catch (error) {
    console.error('fetchParticipates: Error fetching participates:', error)
    throw new Error('Không thể tải danh sách tham gia')
  }
}

export const fetchParticipatesById = async (
  memNum: string,
  rno: number,
  licNo: string
): Promise<Participates | null> => {
  try {
    const response = await axios.get<Participates>(`${API_URL}/${memNum}/${rno}/${licNo}`)
    console.log('fetchParticipatesById: Fetched participates:', response.data)
    return response.data
  } catch (error) {
    console.error('fetchParticipatesById: Error fetching participates:', error)
    return null
  }
}

export const createParticipates = async (participates: Participates): Promise<Participates> => {
  try {
    const response = await axios.post<Participates>(API_URL, participates, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('createParticipates: Created participates:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('createParticipates: Error creating participates:', axiosError.response?.data)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng dữ liệu (415). Vui lòng kiểm tra lại.'
        : (axiosError.response?.data as any)?.message || 'Không thể thêm tham gia'
    )
  }
}

export const updateParticipates = async (
  memNum: string,
  rno: number,
  licNo: string,
  participates: Participates
): Promise<Participates> => {
  try {
    const response = await axios.put<Participates>(`${API_URL}/${memNum}/${rno}/${licNo}`, participates, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('updateParticipates: Updated participates:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('updateParticipates: Error updating participates:', axiosError.response?.data)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng dữ liệu (415). Vui lòng kiểm tra lại.'
        : (axiosError.response?.data as any)?.message || 'Lỗi không thể sửa tham gia'
    )
  }
}

export const deleteParticipates = async (memNum: string, rno: number, licNo: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${memNum}/${rno}/${licNo}`)
    console.log('deleteParticipates: Deleted participates:', {
      memNum,
      rno,
      licNo
    })
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('deleteParticipates: Error deleting participates:', axiosError.response?.data)
    throw new Error((axiosError.response?.data as any)?.message || 'Lỗi không thể xóa khi tham gia')
  }
}
