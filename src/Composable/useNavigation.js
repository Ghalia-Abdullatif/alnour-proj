import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  return {
    goToLogin: () => router.push('/login'),
    goToHome: () => router.push('/'),
    goToDashboard: () => router.push('/dashboard'),
    goToJoinRequest: () => router.push({ name: 'JoinRequest' })
  }
}