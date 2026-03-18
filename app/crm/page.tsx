'use client'

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Badge,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  PeopleIcon,
  Building2Icon,
  ArrowUpIcon
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

export default function CRMDashboard() {
  const router = useRouter()
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

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

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
      // Fetch companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      // Fetch customers
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

      // Calculate stats
      setStats({
        totalCustomers: customersData?.length || 0,
        totalCompanies: companiesData?.length || 0,
        newCustomersToday: customersData?.filter(c => 
          new Date(c.created_at).toDateString() === new Date().toDateString()
        ).length || 0,
        activeUsers: 0 // TODO: Calculate active users
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

  if (loading) {
    return <Container maxW="container.xl" py={8}>Loading...</Container>
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg={cardBg} boxShadow="sm" mb={8}>
        <Container maxW="container.xl" py={4}>
          <Flex align="center">
            <HStack spacing={4}>
              <Avatar size="sm" name="Ensign CRM" bg="blue.500" />
              <Box>
                <Heading size="lg">Ensign CRM</Heading>
                <Text fontSize="sm" color="gray.600">Centralized Customer Management</Text>
              </Box>
            </HStack>
            <Spacer />
            <HStack spacing={4}>
              <IconButton aria-label="Notifications" icon={<BellIcon />} variant="ghost" />
              <IconButton aria-label="Settings" icon={<SettingsIcon />} variant="ghost" />
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {user?.email}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={8}>
        {/* Stats Cards */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Flex align="center">
                <Box p={3} bg="blue.100" borderRadius="lg">
                  <Icon as={PeopleIcon} w={6} h={6} color="blue.600" />
                </Box>
                <Box ml={4}>
                  <StatLabel color="gray.600">Total Customers</StatLabel>
                  <StatNumber fontSize="2xl">{stats.totalCustomers}</StatNumber>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Flex align="center">
                <Box p={3} bg="green.100" borderRadius="lg">
                  <Icon as={Building2Icon} w={6} h={6} color="green.600" />
                </Box>
                <Box ml={4}>
                  <StatLabel color="gray.600">Total Companies</StatLabel>
                  <StatNumber fontSize="2xl">{stats.totalCompanies}</StatNumber>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Flex align="center">
                <Box p={3} bg="purple.100" borderRadius="lg">
                  <Icon as={ArrowUpIcon} w={6} h={6} color="purple.600" />
                </Box>
                <Box ml={4}>
                  <StatLabel color="gray.600">New Today</StatLabel>
                  <StatNumber fontSize="2xl">{stats.newCustomersToday}</StatNumber>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Flex align="center">
                <Box p={3} bg="orange.100" borderRadius="lg">
                  <Icon as={TimeIcon} w={6} h={6} color="orange.600" />
                </Box>
                <Box ml={4}>
                  <StatLabel color="gray.600">Active Users</StatLabel>
                  <StatNumber fontSize="2xl">{stats.activeUsers}</StatNumber>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </Grid>

        {/* Filters and Search */}
        <Card bg={cardBg} mb={6}>
          <CardBody>
            <HStack spacing={4}>
              <Box flex={1}>
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftElement={<SearchIcon color="gray.400" />}
                />
              </Box>
              {canViewAllCompanies && (
                <Select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  w="250px"
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
                colorScheme="blue"
                onClick={() => router.push('/register')}
              >
                New Customer
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Recent Customers Table */}
        <Card bg={cardBg} overflow="hidden">
          <CardHeader>
            <Heading size="md">Recent Customers</Heading>
          </CardHeader>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Customer</Th>
                  {canViewAllCompanies && <Th>Company</Th>}
                  <Th>Phone</Th>
                  <Th>Email</Th>
                  <Th>Registered</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <Tr key={customer.id}>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">
                          {customer.first_name} {customer.surname}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {customer.physical_address}
                        </Text>
                      </VStack>
                    </Td>
                    {canViewAllCompanies && (
                      <Td>
                        <Badge colorScheme="blue">{customer.company_name}</Badge>
                      </Td>
                    )}
                    <Td>{customer.phone_number}</Td>
                    <Td>{customer.email || '-'}</Td>
                    <Td>
                      {new Date(customer.created_at).toLocaleDateString()}
                    </Td>
                    <Td>
                      <HStack>
                        <IconButton
                          aria-label="View"
                          icon={<ViewIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/customer/${customer.id}`)}
                        />
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/edit/${customer.id}`)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
