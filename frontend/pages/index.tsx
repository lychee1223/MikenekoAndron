import { Button, Flex, Stack, Text } from '@chakra-ui/react'
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
      if (!token) {
        router.push('/login')
      }

      const res = await fetch('http://localhost:8000/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const user = await res.json()
        setUser(user)
      }
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
    <Flex align="center" justify="center" h="100vh">
      <Stack>
        <Text>Hello, {user.username}!</Text>
        <Button onClick={logout} colorScheme="blue">
          Logout
        </Button>
      </Stack>
    </Flex>
  )
}
