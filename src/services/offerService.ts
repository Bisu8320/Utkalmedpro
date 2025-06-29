import { apiService } from './apiService'
import { API_ENDPOINTS } from '../config/api'
import { Offer } from '../types'

export interface CreateOfferData {
  title: string
  description: string
  discount: string
  validUntil: string
  isActive?: boolean
}

export interface OfferResponse {
  success: boolean
  offer?: Offer
  offers?: Offer[]
  message?: string
}

class OfferService {
  async getAllOffers(): Promise<OfferResponse> {
    try {
      const response = await apiService.get<OfferResponse>(API_ENDPOINTS.offers.getAll)
      return response
    } catch (error) {
      console.error('Error fetching offers:', error)
      throw error
    }
  }

  async getActiveOffers(): Promise<OfferResponse> {
    try {
      const response = await apiService.get<OfferResponse>(API_ENDPOINTS.offers.getActive)
      return response
    } catch (error) {
      console.error('Error fetching active offers:', error)
      throw error
    }
  }

  async getOfferById(id: string): Promise<OfferResponse> {
    try {
      const response = await apiService.get<OfferResponse>(API_ENDPOINTS.offers.getById(id))
      return response
    } catch (error) {
      console.error('Error fetching offer:', error)
      throw error
    }
  }

  async createOffer(data: CreateOfferData): Promise<OfferResponse> {
    try {
      const response = await apiService.post<OfferResponse>(API_ENDPOINTS.offers.create, data)
      return response
    } catch (error) {
      console.error('Error creating offer:', error)
      throw error
    }
  }

  async updateOffer(id: string, data: Partial<CreateOfferData>): Promise<OfferResponse> {
    try {
      const response = await apiService.put<OfferResponse>(API_ENDPOINTS.offers.update(id), data)
      return response
    } catch (error) {
      console.error('Error updating offer:', error)
      throw error
    }
  }

  async deleteOffer(id: string): Promise<OfferResponse> {
    try {
      const response = await apiService.delete<OfferResponse>(API_ENDPOINTS.offers.delete(id))
      return response
    } catch (error) {
      console.error('Error deleting offer:', error)
      throw error
    }
  }
}

export const offerService = new OfferService()