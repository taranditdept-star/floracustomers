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
  HStack,
  Flex,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { EmailIcon, LockIcon } from '@chakra-ui/icons'

export default function ModernLoginPage() {
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          companies(*)
        `)
        .eq('id', data.user?.id)
        .single()

      // If no profile exists, create one
      if (profileError || !profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user?.id,
            email: data.user?.email,
            role: 'company_user',
          })
        
        if (insertError) {
          console.error('Profile creation error:', insertError)
        }
      }

      // Check if user has access
      if (profile && !profile.company_id && profile.role !== 'marketing_manager' && !profile.can_view_all_companies) {
        toast({
          title: 'Access Denied',
          description: 'You are not assigned to any company. Please contact your administrator.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        return
      }

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
    <Flex minH="100vh" bg="gray.50">
      <Flex
        flex={1}
        display={{ base: 'none', lg: 'flex' }}
        bgGradient="linear(to-br, brand.500, brand.700)"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-10%"
          right="-10%"
          w="500px"
          h="500px"
          bg="whiteAlpha.100"
          borderRadius="full"
        />
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w="600px"
          h="600px"
          bg="whiteAlpha.100"
          borderRadius="full"
        />
        
        <VStack
          spacing={6}
          justify="center"
          align="center"
          p={12}
          position="relative"
          zIndex={1}
        >
          <Heading size="2xl" color="white" textAlign="center">
            Welcome Back!
          </Heading>
          <Text fontSize="xl" color="whiteAlpha.900" textAlign="center" maxW="md">
            Manage customer data across all Ensign Holdings subsidiaries from one centralized platform
          </Text>
          <HStack spacing={4} mt={8}>
            <Box
              w="12px"
              h="12px"
              bg="white"
              borderRadius="full"
              opacity={0.6}
            />
            <Box
              w="12px"
              h="12px"
              bg="white"
              borderRadius="full"
            />
            <Box
              w="12px"
              h="12px"
              bg="white"
              borderRadius="full"
              opacity={0.6}
            />
          </HStack>
        </VStack>
      </Flex>

      <Flex flex={1} align="center" justify="center" p={8}>
        <Container maxW="md">
          <VStack spacing={8} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Heading size="xl" color="gray.800">
                Sign In
              </Heading>
              <Text color="gray.600">
                Enter your credentials to access your account
              </Text>
            </VStack>

            <Box
              bg="white"
              p={8}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px"
              borderColor="gray.100"
            >
              <form onSubmit={handleLogin}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="600">Email Address</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <EmailIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        size="lg"
                        borderRadius="lg"
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ borderColor: 'brand.500', bg: 'white' }}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="600">Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        size="lg"
                        borderRadius="lg"
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'gray.300' }}
                        _focus={{ borderColor: 'brand.500', bg: 'white' }}
                      />
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    borderRadius="lg"
                    fontSize="md"
                    fontWeight="600"
                    h="56px"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </Box>

            <Text textAlign="center" color="gray.600" fontSize="sm">
              Need help? Contact your system administrator
            </Text>
          </VStack>
        </Container>
      </Flex>
    </Flex>
  )
}
