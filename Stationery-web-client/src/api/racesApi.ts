import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/races`

export interface Race {
  rno: number
  licNo: string
  dir: string
  malWin?: string | null
  femWin?: string | null
  spName: string
}

export const fetchRaces = async (): Promise<Race[]> => {
  try {
    const response = await axios.get<Race[]>(API_URL, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('Fetched races:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Fetch races error:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch races')
  }
}

export const createRace = async (race: Race): Promise<Race> => {
  try {
    const payload = {
      rno: race.rno,
      licNo: race.licNo,
      dir: race.dir,
      malWin: race.malWin || null,
      femWin: race.femWin || null,
      spName: race.spName
    }
    console.log('Creating race with payload:', payload)
    const response = await axios.post<Race>(API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('Create race response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Create race error:', error.response?.data || error)
    throw new Error(error.response?.data?.message || 'Failed to create race')
  }
}

export const updateRace = async (rno: number, licNo: string, race: Race): Promise<Race> => {
  try {
    const payload = {
      rno: race.rno,
      licNo: race.licNo,
      dir: race.dir,
      malWin: race.malWin || null,
      femWin: race.femWin || null,
      spName: race.spName
    }
    console.log('Updating race with rno:', rno, 'licNo:', licNo, 'payload:', payload)
    const response = await axios.put<Race>(`${API_URL}/${rno}/${licNo}`, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('Update race response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Update race error:', error.response?.data || error)
    throw new Error(error.response?.data?.message || 'Failed to update race')
  }
}

export const deleteRace = async (rno: number, licNo: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${rno}/${licNo}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('Deleted race with rno:', rno, 'licNo:', licNo)
  } catch (error: any) {
    console.error('Delete race error:', error.response?.data || error)
    throw new Error(error.response?.data?.message || 'Failed to delete race')
  }
}
