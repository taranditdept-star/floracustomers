'use client'

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Badge,
  Tabs,
  TabList,
  Tab,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { 
  SearchIcon, 
  ChevronDownIcon,
  AddIcon,
  CalendarIcon,
  DeleteIcon,
  SettingsIcon,
  ViewIcon,
  EditIcon,
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
  company_specific_fields: any
}

export default function CleanCRMDashboard() {
  const router = useRouter()
  const toast = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(new Set(filteredCustomers.map(c => c.id)))
    } else {
      setSelectedCustomers(new Set())
    }
  }

  const handleSelectCustomer = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomers)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedCustomers(newSelected)
  }

  const filteredCustomers = customers.filter(customer =>
    `${customer.first_name} ${customer.surname} ${customer.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (customer: Customer) => {
    const statuses = ['Approve', 'Incomplete', 'Completed', 'Pending']
    const colors = ['green', 'red', 'blue', 'orange']
    const randomIndex = Math.floor(Math.random() * statuses.length)
    
    return (
      <Badge
        colorScheme={colors[randomIndex]}
        px={3}
        py={1}
        borderRadius="md"
        fontSize="xs"
        fontWeight="600"
      >
        {statuses[randomIndex]}
      </Badge>
    )
  }

  const Sidebar = () => (
    <Box
      w="240px"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      h="100vh"
      position="fixed"
      left="0"
      top="0"
    >
      <VStack align="stretch" spacing={0} h="full">
        <Box p={6} borderBottom="1px" borderColor="gray.200">
          <Heading size="md" color="gray.700">Ensign CRM</Heading>
        </Box>

        <VStack align="stretch" spacing={0} p={3} flex={1}>
          <Button
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            leftIcon={<Box w="4px" h="4px" bg="orange.500" borderRadius="full" />}
            fontWeight="500"
            color="gray.600"
            _hover={{ bg: 'gray.50' }}
          >
            Activity
            <Badge ml="auto" colorScheme="orange" borderRadius="full">12</Badge>
          </Button>
          
          <Button
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            leftIcon={<CalendarIcon />}
            fontWeight="500"
            color="gray.600"
            _hover={{ bg: 'gray.50' }}
          >
            Dashboard
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            leftIcon={<ViewIcon />}
            fontWeight="500"
            color="gray.600"
            _hover={{ bg: 'gray.50' }}
          >
            Clients
          </Button>

          <Button
            justifyContent="flex-start"
            variant="solid"
            size="sm"
            leftIcon={<Box as="span" fontSize="lg">📋</Box>}
            fontWeight="600"
            bg="gray.100"
            color="gray.800"
            _hover={{ bg: 'gray.200' }}
            borderLeft="3px solid"
            borderColor="gray.800"
            borderRadius="md"
          >
            Customers
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            leftIcon={<Box as="span" fontSize="lg">📊</Box>}
            fontWeight="500"
            color="gray.600"
            _hover={{ bg: 'gray.50' }}
          >
            Reports
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            leftIcon={<SettingsIcon />}
            fontWeight="500"
            color="gray.600"
            _hover={{ bg: 'gray.50' }}
          >
            Settings
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            leftIcon={<Box as="span" fontSize="lg">❓</Box>}
            fontWeight="500"
            color="gray.600"
            _hover={{ bg: 'gray.50' }}
          >
            Support
          </Button>
        </VStack>

        <Box p={3} borderTop="1px" borderColor="gray.200">
          <Button
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            leftIcon={<Box as="span" fontSize="lg">❓</Box>}
            fontWeight="500"
            color="gray.600"
            w="full"
          >
            Need Help?
          </Button>
        </Box>
      </VStack>
    </Box>
  )

  return (
    <Box bg="gray.50" minH="100vh">
      <Sidebar />

      <Box ml="240px">
        <Box bg="white" borderBottom="1px" borderColor="gray.200" px={8} py={4}>
          <Flex align="center" justify="space-between" mb={4}>
            <HStack spacing={2}>
              <IconButton
                aria-label="Back"
                icon={<ChevronDownIcon transform="rotate(90deg)" />}
                variant="ghost"
                size="sm"
              />
              <Text fontSize="sm" color="gray.500">Customers /</Text>
              <Text fontSize="sm" fontWeight="600">Manage Customers</Text>
            </HStack>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="sm"
              borderRadius="md"
              onClick={() => router.push('/register')}
            >
              Add New
            </Button>
          </Flex>

          <Tabs index={activeTab} onChange={setActiveTab} variant="unstyled">
            <TabList borderBottom="2px" borderColor="gray.100">
              <Tab
                fontSize="sm"
                fontWeight="600"
                color="gray.600"
                _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                pb={3}
              >
                All Customers
                <Badge ml={2} colorScheme="gray" borderRadius="full" fontSize="xs">{filteredCustomers.length}</Badge>
              </Tab>
              <Tab
                fontSize="sm"
                fontWeight="600"
                color="gray.600"
                _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                pb={3}
              >
                Active Customers
                <Badge ml={2} colorScheme="gray" borderRadius="full" fontSize="xs">50</Badge>
              </Tab>
              <Tab
                fontSize="sm"
                fontWeight="600"
                color="gray.600"
                _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                pb={3}
              >
                Pending
                <Badge ml={2} colorScheme="gray" borderRadius="full" fontSize="xs">15</Badge>
              </Tab>
            </TabList>
          </Tabs>
        </Box>

        <Box px={8} py={6}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              <IconButton aria-label="Calendar" icon={<CalendarIcon />} variant="outline" size="sm" />
              <IconButton aria-label="Delete" icon={<DeleteIcon />} variant="outline" size="sm" />
              <IconButton aria-label="Sort" icon={<Box as="span">⇅</Box>} variant="outline" size="sm" />
              <IconButton aria-label="Filter" icon={<SettingsIcon />} variant="outline" size="sm" />
              <InputGroup maxW="300px" size="sm">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                  borderRadius="md"
                />
              </InputGroup>
            </HStack>
            <IconButton aria-label="More" icon={<Box as="span">⋯</Box>} variant="ghost" size="sm" />
          </Flex>

          <Box bg="white" borderRadius="lg" border="1px" borderColor="gray.200" overflow="hidden">
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th w="40px">
                    <Checkbox
                      isChecked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </Th>
                  <Th color="gray.600" fontWeight="600" fontSize="xs">Customer ID</Th>
                  <Th color="gray.600" fontWeight="600" fontSize="xs">Customer Name</Th>
                  <Th color="gray.600" fontWeight="600" fontSize="xs">Company</Th>
                  <Th color="gray.600" fontWeight="600" fontSize="xs">Phone</Th>
                  <Th color="gray.600" fontWeight="600" fontSize="xs">Date</Th>
                  <Th color="gray.600" fontWeight="600" fontSize="xs">Payment Status</Th>
                  <Th color="gray.600" fontWeight="600" fontSize="xs">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCustomers.map((customer, index) => (
                  <Tr key={customer.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <Checkbox
                        isChecked={selectedCustomers.has(customer.id)}
                        onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                      />
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="blue.600" fontWeight="600">
                        {String(index + 1).padStart(10, '0')}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Box as="span" fontSize="lg">{index % 3 === 0 ? '👤' : '👥'}</Box>
                        <Text fontSize="sm" fontWeight="500">{customer.first_name} {customer.surname}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Box as="span" fontSize="sm">🏢</Box>
                        <Text fontSize="sm" color="gray.600">{customer.company_name}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">{customer.phone_number}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(customer.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">Paid</Text>
                    </Td>
                    <Td>
                      {getStatusBadge(customer)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {filteredCustomers.length === 0 && (
              <Box textAlign="center" py={12}>
                <Text color="gray.500">No customers found</Text>
              </Box>
            )}
          </Box>

          <Flex align="center" justify="space-between" mt={4}>
            <HStack spacing={2}>
              <Button size="sm" variant="outline">1</Button>
              <Button size="sm" variant="ghost">2</Button>
              <Button size="sm" variant="ghost">10</Button>
              <Button size="sm" variant="ghost">12</Button>
              <Button size="sm" variant="ghost">13</Button>
              <Button size="sm" variant="ghost">14</Button>
            </HStack>
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.600">Rows Count</Text>
              <Menu>
                <MenuButton as={Button} size="sm" variant="ghost" rightIcon={<ChevronDownIcon />}>
                  ⋯
                </MenuButton>
                <MenuList>
                  <MenuItem>10 per page</MenuItem>
                  <MenuItem>25 per page</MenuItem>
                  <MenuItem>50 per page</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
