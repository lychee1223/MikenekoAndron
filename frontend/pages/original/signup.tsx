import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const signup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsLoading(true)

    const target = event.target as typeof event.target & {
      username: { value: string }
      password: { value: string }
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: target.username.value,
        password: target.password.value,
      }),
    })
    if (!res.ok) {
      const error = await res.json()
      setErrorMessage(error.detail)
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('username', target.username.value)
    formData.append('password', target.password.value)
    const token = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/token`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json())
    Cookies.set('access_token', token.access_token)
    router.push('/')
  }

  return (
    <Stack align="center" justify="center" h="100vh">
      <form onSubmit={signup}>
        <Stack w="md">
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              onChange={() => setErrorMessage('')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              onChange={() => setErrorMessage('')}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            アカウントを作成
          </Button>
        </Stack>
      </form>
      <Text>
        すでにアカウントをお持ちの方は{' '}
        <Link href="/login" color="blue.500">
          ログイン
        </Link>
      </Text>
    </Stack>
  )
}
