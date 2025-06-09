import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/racers`

export const fetchRacers = async () => {
  const response = await axios.get(API_URL)
  return Array.isArray(response.data) ? response.data : []
}

export const createRacer = async (racer: { name: string; address: string; memNum: string }) => {
  const response = await axios.post(API_URL, racer)
  return response.data
}

export const updateRacer = async (memNum: string, racer: { name: string; address: string; memNum: string }) => {
  const response = await axios.put(`${API_URL}/${memNum}`, racer)
  return response.data
}

export const deleteRacer = async (memNum: string) => {
  await axios.delete(`${API_URL}/${memNum}`)
}
