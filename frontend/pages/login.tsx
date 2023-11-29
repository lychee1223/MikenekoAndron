import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [showUnauthrizedError, setShowUnauthrizedError] = useState(false)

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const res = await fetch('http://localhost:8000/token', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      setShowUnauthrizedError(true)
      return
    }
    const token = await res.json()
    localStorage.setItem('token', token.access_token)
    router.push('/')
  }

  return (
    <Flex align="center" justify="center" h="100vh">
      <form onSubmit={login}>
        <Stack w="md">
          {showUnauthrizedError && (
            <Alert status="error">
              <AlertIcon />
              ユーザー名またはパスワードが正しくありません
            </Alert>
          )}
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              onChange={() => setShowUnauthrizedError(false)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              onChange={() => setShowUnauthrizedError(false)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Login
          </Button>
        </Stack>
      </form>
    </Flex>
  )
}
