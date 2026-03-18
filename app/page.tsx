'use client'

import {
  Box,
  Button,
  Container,
  VStack,
  Heading,
  Text,
  HStack,
  Card,
  CardBody,
  Icon,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Building2Icon, 
  PeopleIcon, 
  TimeIcon,
  CheckCircleIcon 
} from '@chakra-ui/icons'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    checkSession()
  }, [])

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/crm')
    }
  }

  const features = [
    {
      icon: Building2Icon,
      title: 'Multi-Company Support',
      description: 'Manage customer data across all Ensign Holdings subsidiaries',
    },
    {
      icon: PeopleIcon,
      title: 'Role-Based Access',
      description: 'Marketing managers see all data, companies see only their data',
    },
    {
      icon: TimeIcon,
      title: 'Real-time Analytics',
      description: 'Track customer registrations and company performance',
    },
    {
      icon: CheckCircleIcon,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security',
    },
  ]

  const companies = [
    'Flora Gas', 'MountPlus', 'Global Energies Africa', 'Flora Solar & Tech',
    'New Impetus', 'Continental Treasures Mining', 'Ecomatt Foods',
    'Granite Haven Bakery', 'Onset Transport'
  ]

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" boxShadow="sm">
        <Container maxW="container.xl" py={4}>
          <HStack justify="space-between">
            <Heading size="lg" color="blue.600">
              Ensign CRM
            </Heading>
            <Button
              colorScheme="blue"
              onClick={() => router.push('/login')}
            >
              Staff Login
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={8} textAlign="center">
          <Heading size="2xl" fontWeight="bold">
            Centralized Customer Management
            <Text as="span" color="blue.600"> for Ensign Holdings</Text>
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            A modern CRM system that brings together customer data from all subsidiaries 
            under one platform, while maintaining data privacy and security.
          </Text>
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => router.push('/login')}
            >
              Login to System
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/register')}
            >
              Quick Registration
            </Button>
          </HStack>
        </VStack>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mt={20}>
          {features.map((feature, index) => (
            <Card key={index} h="full">
              <CardBody>
                <VStack spacing={4}>
                  <Icon as={feature.icon} w={10} h={10} color="blue.500" />
                  <Heading size="md">{feature.title}</Heading>
                  <Text textAlign="center" color="gray.600">
                    {feature.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Companies Section */}
        <Box mt={20}>
          <Heading size="xl" textAlign="center" mb={8}>
            Supported Companies
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
            {companies.map((company, index) => (
              <Card key={index} variant="outline">
                <CardBody textAlign="center">
                  <Text fontWeight="medium">{company}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Box mt={20} bg="blue.600" borderRadius="lg" p={8}>
          <VStack spacing={4} color="white">
            <Heading size="lg">Ready to get started?</Heading>
            <Text textAlign="center" maxW="md">
              Contact your system administrator to get your login credentials 
              and start managing your customer data efficiently.
            </Text>
            <Button
              size="lg"
              bg="white"
              color="blue.600"
              _hover={{ bg: 'gray.100' }}
              onClick={() => router.push('/login')}
            >
              Login Now
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
