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

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    setIsLoading(true)
    
    const formData = new FormData(event.currentTarget)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/token`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const error = await res.json()
      setErrorMessage(error.detail)
      setIsLoading(false)
      return
    }
    const token = await res.json()
    Cookies.set('access_token', token.access_token)
    router.push('/')
  }

  return (
    <Stack align="center" justify="center" h="100vh">
      <form onSubmit={login}>
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
            ログイン
          </Button>
        </Stack>
      </form>
      <Text>
        アカウントをお持ちでない方は{' '}
        <Link href="/signup" color="blue.500">
          アカウントを作成
        </Link>
      </Text>
    </Stack>
  )
}
