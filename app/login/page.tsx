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
  InputGroup,
  InputLeftElement,
  Flex,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { EmailIcon, LockIcon } from '@chakra-ui/icons'

export default function UltraModernLoginPage() {
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

      toast({
        title: 'Welcome back!',
        description: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/crm')
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
    <Flex minH="100vh" align="center" justify="center" position="relative">
      {/* Animated Background Circles */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="600px"
        h="600px"
        bg="whiteAlpha.100"
        borderRadius="full"
        filter="blur(80px)"
        animation="float 6s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="700px"
        h="700px"
        bg="whiteAlpha.100"
        borderRadius="full"
        filter="blur(80px)"
        animation="float 8s ease-in-out infinite reverse"
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <Box
          bg="whiteAlpha.200"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          border="1px solid"
          borderColor="whiteAlpha.300"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          p={10}
          className="animate-fade-in"
        >
          <VStack spacing={8} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Heading size="2xl" color="white" fontWeight="800">
                Welcome Back
              </Heading>
              <Text color="whiteAlpha.800" fontSize="lg">
                Sign in to your account
              </Text>
            </VStack>

            <form onSubmit={handleLogin}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="white" fontWeight="600" fontSize="sm">
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <EmailIcon color="whiteAlpha.600" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      size="lg"
                      bg="whiteAlpha.200"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.600' }}
                      _hover={{ borderColor: 'whiteAlpha.400', bg: 'whiteAlpha.250' }}
                      _focus={{ borderColor: 'white', bg: 'whiteAlpha.300', boxShadow: '0 0 0 1px white' }}
                      borderRadius="xl"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white" fontWeight="600" fontSize="sm">
                    Password
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color="whiteAlpha.600" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="lg"
                      bg="whiteAlpha.200"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.600' }}
                      _hover={{ borderColor: 'whiteAlpha.400', bg: 'whiteAlpha.250' }}
                      _focus={{ borderColor: 'white', bg: 'whiteAlpha.300', boxShadow: '0 0 0 1px white' }}
                      borderRadius="xl"
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  bg="white"
                  color="purple.600"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  borderRadius="xl"
                  fontSize="md"
                  fontWeight="700"
                  h="56px"
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="whiteAlpha.700" fontSize="sm">
              Need help? Contact your system administrator
            </Text>
          </VStack>
        </Box>

        <Text textAlign="center" color="whiteAlpha.600" fontSize="xs" mt={6}>
          © 2026 Ensign Holdings. All rights reserved.
        </Text>
      </Container>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </Flex>
  )
}
