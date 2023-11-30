import { Button, Heading, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type User = {
  id: number
  username: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!res.ok) {
        router.push('/login')
        return
      }
      const user = await res.json()
      setUser(user)
    }
    fetchUser()
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Stack align="center" justify="center" h="100vh">
      <Heading>Hello, {user.username}!</Heading>
      <Button onClick={logout} colorScheme="blue">
        Logout
      </Button>
    </Stack>
  )
}
