import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { ProfileResponseDto, UpdateProfileDto } from "@/db/dtos/profiles.dto";

// ✅ Get a single profile by userId
export const useGetProfileQuery = (userId: string) =>
  useQuery<ProfileResponseDto | null>({
    queryKey: ["profile", userId],
    queryFn: () => profileService.getByUserId(userId),
    enabled: !!userId,
  });

export const useGetProfile = () => {
  return useMutation<ProfileResponseDto | null, Error, string>({
    // The argument (string) is userId
    mutationFn: async (userId: string) => await profileService.getByUserId(userId),
  });
};

// ✅ Get all profiles
export const useGetAllProfiles = () =>
  useQuery<ProfileResponseDto[]>({
    queryKey: ["profiles"],
    queryFn: () => profileService.getAll(),
  });

// ✅ Create profile
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponseDto, Error, ProfileResponseDto>({
    mutationFn: (payload) => profileService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};

// ✅ Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProfileResponseDto,
    Error,
    { userId: string; data: UpdateProfileDto }
  >({
    mutationFn: ({ userId, data }) => profileService.update(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
};

// ✅ Delete profile
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (userId) => profileService.delete(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};
