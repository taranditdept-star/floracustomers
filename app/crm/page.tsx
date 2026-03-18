'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Divider,
  Icon,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { 
  ChevronDownIcon, 
  SearchIcon, 
  BellIcon, 
  SettingsIcon,
  ViewIcon,
  EditIcon,
  AddIcon,
  TimeIcon,
  InfoIcon,
  StarIcon,
  ArrowUpIcon,
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons'

interface Company {
  id: string
  name: string
  parent_company: string
  industry: string
}

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

interface DashboardStats {
  totalCustomers: number
  totalCompanies: number
  newCustomersToday: number
  activeUsers: number
}

export default function ModernCRMDashboard() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [user, setUser] = useState<any>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalCompanies: 0,
    newCustomersToday: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    setUser({ ...session.user, ...profile })
  }

  const fetchDashboardData = async () => {
    try {
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      const { data: customersData } = await supabase
        .from('customers')
        .select(`
          *,
          companies(name)
        `)
        .order('created_at', { ascending: false })

      if (companiesData) setCompanies(companiesData)
      if (customersData) {
        setCustomers(customersData.map(c => ({
          ...c,
          company_name: c.companies?.name || 'Unknown'
        })))
      }

      setStats({
        totalCustomers: customersData?.length || 0,
        totalCompanies: companiesData?.length || 0,
        newCustomersToday: customersData?.filter(c => 
          new Date(c.created_at).toDateString() === new Date().toDateString()
        ).length || 0,
        activeUsers: 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = `${customer.first_name} ${customer.surname} ${customer.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    const matchesCompany = selectedCompany === 'all' || customer.company_id === selectedCompany
    
    return matchesSearch && matchesCompany
  })

  const canViewAllCompanies = user?.role === 'marketing_manager' || user?.can_view_all_companies

  const Sidebar = () => (
    <Box
      w="280px"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      h="100vh"
      position="fixed"
      left="0"
      top="0"
      display={{ base: 'none', lg: 'block' }}
    >
      <VStack align="stretch" spacing={0} h="full">
        <Box p={6} borderBottom="1px" borderColor="gray.200">
          <Heading size="md" color="brand.600">Ensign CRM</Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>Customer Management</Text>
        </Box>

        <VStack align="stretch" spacing={1} p={4} flex={1}>
          <Button
            justifyContent="flex-start"
            variant="ghost"
            leftIcon={<InfoIcon />}
            colorScheme="brand"
            bg="brand.50"
            color="brand.700"
          >
            Dashboard
          </Button>
          <Button
            justifyContent="flex-start"
            variant="ghost"
            leftIcon={<StarIcon />}
            onClick={() => router.push('/register')}
          >
            Register Customer
          </Button>
          <Button
            justifyContent="flex-start"
            variant="ghost"
            leftIcon={<ViewIcon />}
          >
            View All
          </Button>
          <Button
            justifyContent="flex-start"
            variant="ghost"
            leftIcon={<TimeIcon />}
          >
            Recent Activity
          </Button>
        </VStack>

        <Box p={4} borderTop="1px" borderColor="gray.200">
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              w="full"
              justifyContent="flex-start"
              leftIcon={<Avatar size="sm" name={user?.email} />}
              rightIcon={<ChevronDownIcon />}
            >
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="600">{user?.email}</Text>
                <Text fontSize="xs" color="gray.500">{user?.role}</Text>
              </VStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
              <MenuItem onClick={handleSignOut} color="red.500">Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </VStack>
    </Box>
  )

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <VStack spacing={4}>
          <Text>Loading...</Text>
        </VStack>
      </Flex>
    )
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Sidebar />

      <Box ml={{ base: 0, lg: '280px' }}>
        <Box
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
          px={6}
          py={4}
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Flex align="center" justify="space-between">
            <HStack spacing={4}>
              <IconButton
                aria-label="Menu"
                icon={<HamburgerIcon />}
                variant="ghost"
                display={{ base: 'flex', lg: 'none' }}
                onClick={onOpen}
              />
              <Heading size="lg">Dashboard</Heading>
            </HStack>
            <HStack spacing={3}>
              <IconButton aria-label="Notifications" icon={<BellIcon />} variant="ghost" borderRadius="full" />
              <IconButton aria-label="Settings" icon={<SettingsIcon />} variant="ghost" borderRadius="full" />
            </HStack>
          </Flex>
        </Box>

        <Container maxW="container.xl" py={8}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <HStack spacing={4}>
                <Box p={3} bg="blue.50" borderRadius="lg">
                  <Icon as={InfoIcon} w={6} h={6} color="blue.500" />
                </Box>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm">Total Customers</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold">{stats.totalCustomers}</StatNumber>
                  <StatHelpText color="green.500" fontSize="xs">
                    <ArrowUpIcon /> +12% from last month
                  </StatHelpText>
                </Stat>
              </HStack>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <HStack spacing={4}>
                <Box p={3} bg="purple.50" borderRadius="lg">
                  <Icon as={StarIcon} w={6} h={6} color="purple.500" />
                </Box>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm">Companies</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold">{stats.totalCompanies}</StatNumber>
                  <StatHelpText color="gray.500" fontSize="xs">
                    Active subsidiaries
                  </StatHelpText>
                </Stat>
              </HStack>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <HStack spacing={4}>
                <Box p={3} bg="green.50" borderRadius="lg">
                  <Icon as={ArrowUpIcon} w={6} h={6} color="green.500" />
                </Box>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm">New Today</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold">{stats.newCustomersToday}</StatNumber>
                  <StatHelpText color="green.500" fontSize="xs">
                    <ArrowUpIcon /> +8% from yesterday
                  </StatHelpText>
                </Stat>
              </HStack>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <HStack spacing={4}>
                <Box p={3} bg="orange.50" borderRadius="lg">
                  <Icon as={TimeIcon} w={6} h={6} color="orange.500" />
                </Box>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm">Active Users</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold">{stats.activeUsers}</StatNumber>
                  <StatHelpText color="gray.500" fontSize="xs">
                    Online now
                  </StatHelpText>
                </Stat>
              </HStack>
            </Box>
          </Grid>

          <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.200" p={6} mb={6}>
            <HStack spacing={4} mb={6}>
              <InputGroup flex={1} maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="lg"
                />
              </InputGroup>
              {canViewAllCompanies && (
                <Select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  maxW="200px"
                  borderRadius="lg"
                >
                  <option value="all">All Companies</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              )}
              <Button
                leftIcon={<AddIcon />}
                colorScheme="brand"
                onClick={() => router.push('/register')}
                borderRadius="lg"
                px={6}
              >
                New Customer
              </Button>
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th color="gray.600" textTransform="none" fontSize="sm" fontWeight="600">Customer</Th>
                    {canViewAllCompanies && <Th color="gray.600" textTransform="none" fontSize="sm" fontWeight="600">Company</Th>}
                    <Th color="gray.600" textTransform="none" fontSize="sm" fontWeight="600">Phone</Th>
                    <Th color="gray.600" textTransform="none" fontSize="sm" fontWeight="600">Email</Th>
                    <Th color="gray.600" textTransform="none" fontSize="sm" fontWeight="600">Registered</Th>
                    <Th color="gray.600" textTransform="none" fontSize="sm" fontWeight="600">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCustomers.slice(0, 10).map((customer) => (
                    <Tr key={customer.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <HStack>
                          <Avatar size="sm" name={`${customer.first_name} ${customer.surname}`} />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="600" fontSize="sm">
                              {customer.first_name} {customer.surname}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {customer.physical_address}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      {canViewAllCompanies && (
                        <Td>
                          <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                            {customer.company_name}
                          </Badge>
                        </Td>
                      )}
                      <Td fontSize="sm">{customer.phone_number}</Td>
                      <Td fontSize="sm" color="gray.600">{customer.email || '-'}</Td>
                      <Td fontSize="sm" color="gray.600">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="View"
                            icon={<ViewIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            borderRadius="lg"
                            onClick={() => router.push(`/customer/${customer.id}`)}
                          />
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            borderRadius="lg"
                            onClick={() => router.push(`/edit/${customer.id}`)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {filteredCustomers.length === 0 && (
              <Box textAlign="center" py={12}>
                <Text color="gray.500" fontSize="lg">No customers found</Text>
                <Text color="gray.400" fontSize="sm" mt={2}>Try adjusting your search or filters</Text>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <HStack justify="space-between">
              <Heading size="md" color="brand.600">Ensign CRM</Heading>
              <IconButton
                aria-label="Close"
                icon={<CloseIcon />}
                variant="ghost"
                onClick={onClose}
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack align="stretch" spacing={1} p={4}>
              <Button
                justifyContent="flex-start"
                variant="ghost"
                leftIcon={<InfoIcon />}
                colorScheme="brand"
                onClick={onClose}
              >
                Dashboard
              </Button>
              <Button
                justifyContent="flex-start"
                variant="ghost"
                leftIcon={<StarIcon />}
                onClick={() => {
                  router.push('/register')
                  onClose()
                }}
              >
                Register Customer
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
