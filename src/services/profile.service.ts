import { CreateProfileDto, ProfileResponseDto, UpdateProfileDto } from "@/db/dtos/profiles.dto";
import axiosClient from "@/lib/axiosClient";

class ProfileService {
  private baseUrl = "/profiles";

  // ✅ Get profile by userId
  async getByUserId(userId: string): Promise<ProfileResponseDto | null> {
    const response = await axiosClient.get<{ profile: ProfileResponseDto | null }>(
      `${this.baseUrl}?userId=${userId}`
    );
    return response.data.profile;
  }

  // ✅ Get all profiles
  async getAll(): Promise<ProfileResponseDto[]> {
    const response = await axiosClient.get<{ profiles: ProfileResponseDto[] }>(
      this.baseUrl
    );
    return response.data.profiles;
  }

  // ✅ Create new profile
  async create(payload: CreateProfileDto): Promise<ProfileResponseDto> {
    const response = await axiosClient.post<{ profile: ProfileResponseDto }>(
      this.baseUrl,
      payload
    );
    return response.data.profile;
  }

  // ✅ Update profile by userId
  async update(userId: string, payload: UpdateProfileDto): Promise<ProfileResponseDto> {
    const response = await axiosClient.patch<{ profile: ProfileResponseDto }>(
      this.baseUrl,
      { userId, data: payload }
    );
    return response.data.profile;
  }

  // ✅ Delete profile by userId
  async delete(userId: string): Promise<void> {
    await axiosClient.delete(this.baseUrl, {
      data: { userId },
    });
  }
}

export const profileService = new ProfileService();
