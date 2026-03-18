'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Badge,
  Avatar,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { 
  SearchIcon, 
  ChevronDownIcon,
  AddIcon,
  BellIcon,
  SettingsIcon,
  ViewIcon,
  EditIcon,
  ArrowUpIcon,
} from '@chakra-ui/icons'

interface Customer {
  id: string
  company_id: string
  company_name: string
  first_name: string
  surname: string
  phone_number: string
  email: string
  physical_address: string
  created_at: string
}

export default function ModernCRMDashboard() {
  const router = useRouter()
  const toast = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
    fetchCustomers()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    setUser(session.user)
  }

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          companies(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setCustomers(data?.map(c => ({
        ...c,
        company_name: c.companies?.name || 'Unknown'
      })) || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredCustomers = customers.filter(customer =>
    `${customer.first_name} ${customer.surname} ${customer.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <Box minH="100vh" bg="transparent" position="relative">
      {/* Glassmorphism Container */}
      <Box
        maxW="1400px"
        mx="auto"
        p={8}
        className="animate-fade-in"
      >
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={8}
          p={6}
          bg="whiteAlpha.200"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="whiteAlpha.300"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        >
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="white" fontWeight="800">
              Ensign CRM
            </Heading>
            <Text color="whiteAlpha.800" fontSize="sm">
              Welcome back, {user?.email}
            </Text>
          </VStack>
          <HStack spacing={4}>
            <IconButton
              aria-label="Notifications"
              icon={<BellIcon />}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              borderRadius="xl"
            />
            <IconButton
              aria-label="Settings"
              icon={<SettingsIcon />}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              borderRadius="xl"
            />
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                _active={{ bg: 'whiteAlpha.300' }}
                borderRadius="xl"
                fontWeight="600"
              >
                Account
              </MenuButton>
              <MenuList bg="white" borderRadius="xl" border="none" boxShadow="xl">
                <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                <MenuItem onClick={handleSignOut} color="red.500">Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
          <Card
            bg="whiteAlpha.200"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="2xl"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="whiteAlpha.800" fontSize="sm" fontWeight="600">
                  Total Customers
                </StatLabel>
                <StatNumber color="white" fontSize="4xl" fontWeight="800">
                  {customers.length}
                </StatNumber>
                <StatHelpText color="green.300" fontWeight="600">
                  <ArrowUpIcon /> +12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card
            bg="whiteAlpha.200"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="2xl"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="whiteAlpha.800" fontSize="sm" fontWeight="600">
                  New This Week
                </StatLabel>
                <StatNumber color="white" fontSize="4xl" fontWeight="800">
                  24
                </StatNumber>
                <StatHelpText color="green.300" fontWeight="600">
                  <ArrowUpIcon /> +8% from last week
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card
            bg="whiteAlpha.200"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="2xl"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="whiteAlpha.800" fontSize="sm" fontWeight="600">
                  Active Companies
                </StatLabel>
                <StatNumber color="white" fontSize="4xl" fontWeight="800">
                  14
                </StatNumber>
                <StatHelpText color="whiteAlpha.700" fontWeight="600">
                  All subsidiaries
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Main Content */}
        <Box
          bg="whiteAlpha.200"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="whiteAlpha.300"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          p={6}
        >
          {/* Search and Actions */}
          <Flex justify="space-between" align="center" mb={6}>
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="whiteAlpha.700" />
              </InputLeftElement>
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="whiteAlpha.200"
                border="1px solid"
                borderColor="whiteAlpha.300"
                color="white"
                _placeholder={{ color: 'whiteAlpha.600' }}
                _hover={{ borderColor: 'whiteAlpha.400' }}
                _focus={{ borderColor: 'white', bg: 'whiteAlpha.300' }}
                borderRadius="xl"
              />
            </InputGroup>
            <Button
              leftIcon={<AddIcon />}
              bg="white"
              color="purple.600"
              _hover={{ bg: 'whiteAlpha.900', transform: 'translateY(-2px)', boxShadow: 'xl' }}
              _active={{ transform: 'translateY(0)' }}
              borderRadius="xl"
              fontWeight="700"
              px={8}
              transition="all 0.2s"
              onClick={() => router.push('/register')}
            >
              Add New Customer
            </Button>
          </Flex>

          {/* Table */}
          <Box
            bg="whiteAlpha.100"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Table variant="simple">
              <Thead bg="whiteAlpha.200">
                <Tr>
                  <Th color="white" fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    Customer
                  </Th>
                  <Th color="white" fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    Company
                  </Th>
                  <Th color="white" fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    Phone
                  </Th>
                  <Th color="white" fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    Email
                  </Th>
                  <Th color="white" fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    Date
                  </Th>
                  <Th color="white" fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <Tr
                    key={customer.id}
                    _hover={{ bg: 'whiteAlpha.200' }}
                    transition="all 0.2s"
                  >
                    <Td>
                      <HStack>
                        <Avatar
                          size="sm"
                          name={`${customer.first_name} ${customer.surname}`}
                          bg="purple.500"
                        />
                        <VStack align="start" spacing={0}>
                          <Text color="white" fontWeight="600" fontSize="sm">
                            {customer.first_name} {customer.surname}
                          </Text>
                          <Text color="whiteAlpha.700" fontSize="xs">
                            {customer.physical_address}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme="purple"
                        bg="whiteAlpha.300"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="600"
                      >
                        {customer.company_name}
                      </Badge>
                    </Td>
                    <Td>
                      <Text color="whiteAlpha.900" fontSize="sm">
                        {customer.phone_number}
                      </Text>
                    </Td>
                    <Td>
                      <Text color="whiteAlpha.900" fontSize="sm">
                        {customer.email || '-'}
                      </Text>
                    </Td>
                    <Td>
                      <Text color="whiteAlpha.800" fontSize="sm">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="View"
                          icon={<ViewIcon />}
                          size="sm"
                          bg="whiteAlpha.200"
                          color="white"
                          _hover={{ bg: 'whiteAlpha.300' }}
                          borderRadius="lg"
                          onClick={() => router.push(`/customer/${customer.id}`)}
                        />
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                          bg="whiteAlpha.200"
                          color="white"
                          _hover={{ bg: 'whiteAlpha.300' }}
                          borderRadius="lg"
                          onClick={() => router.push(`/edit/${customer.id}`)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {filteredCustomers.length === 0 && (
              <Box textAlign="center" py={12}>
                <Text color="whiteAlpha.700" fontSize="lg">
                  No customers found
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
