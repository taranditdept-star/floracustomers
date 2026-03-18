'use client'

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single()

      toast({
        title: 'Login Successful!',
        description: `Welcome back!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Redirect based on role
      if (profile?.role === 'marketing_manager') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={16}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Box textAlign="center">
              <Heading size="lg" color="blue.600">
                Flora Gas
              </Heading>
              <Text fontSize="xl" mt={2}>
                Staff Login
              </Text>
            </Box>

            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  width="full"
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
