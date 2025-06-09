import axios, { AxiosError } from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/directors`

export interface Director {
  name: string
  phoneNo: string
  address: string
  races?: string[]
}

export const fetchDirectors = async (): Promise<Director[]> => {
  try {
    const response = await axios.get<Director[]>(API_URL)
    const data = response.data
    console.log('fetchDirectors: Raw API response:', data)
    if (!Array.isArray(data)) {
      console.warn('fetchDirectors: Response is not an array:', data)
      return []
    }
    const validDirectors = data.filter(
      (director): director is Director =>
        director != null &&
        typeof director.name === 'string' &&
        typeof director.phoneNo === 'string' &&
        typeof director.address === 'string'
    )
    console.log('fetchDirectors: Valid directors:', validDirectors)
    return validDirectors
  } catch (error) {
    console.error('fetchDirectors: Error fetching directors:', error)
    throw new Error('Không thể tải danh sách giám đốc')
  }
}

export const fetchDirectorByName = async (name: string): Promise<Director | null> => {
  try {
    const response = await axios.get<Director>(`${API_URL}/${name}`)
    console.log('fetchDirectorByName: Fetched director:', response.data)
    return response.data
  } catch (error) {
    console.error('fetchDirectorByName: Error fetching director:', error)
    return null
  }
}

export const createDirector = async (director: Director): Promise<Director> => {
  try {
    const response = await axios.post<Director>(API_URL, director, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('createDirector: Created director:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('createDirector: Error creating director:', axiosError)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng (415). Vui lòng kiểm tra lại.'
        : axiosError.response?.data?.message || 'Không thể thêm giám đốc'
    )
  }
}

export const updateDirector = async (name: string, director: Director): Promise<Director> => {
  try {
    const response = await axios.put<Director>(`${API_URL}/${name}`, director, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('updateDirector: Updated director:', response.data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('updateDirector: Error updating director:', axiosError)
    throw new Error(
      axiosError.response?.status === 415
        ? 'Dữ liệu không đúng định dạng (415). Vui lòng kiểm tra lại.'
        : axiosError.response?.data?.message || 'Không thể sửa giám đốc'
    )
  }
}

export const deleteDirector = async (name: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${name}`)
    console.log('deleteDirector: Deleted director:', name)
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('deleteDirector: Error deleting director:', axiosError)
    throw new Error(axiosError.response?.data?.message || 'Không thể xóa giám đốc')
  }
}
