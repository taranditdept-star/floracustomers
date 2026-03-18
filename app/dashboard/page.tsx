'use client'

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
  Badge,
  Spinner,
  Input,
  Select,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { EditIcon, ViewIcon, ExitIcon } from '@chakra-ui/icons'

interface Customer {
  id: string
  first_name: string
  surname: string
  phone_number: string
  gender: string
  physical_address: string
  family_size: string | null
  cylinder_size: string
  quantity: number
  usage_frequency: string | null
  customer_type: string
  payment_method: string | null
  requires_delivery: boolean
  additional_notes: string | null
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCustomers()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    }
  }

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error: any) {
      toast({
        title: 'Error fetching customers',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleEdit = (customerId: string) => {
    router.push(`/edit/${customerId}`)
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = `${customer.first_name} ${customer.surname} ${customer.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || customer.customer_type === filterType
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading customer data...</Text>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Customer Dashboard</Heading>
          <Button onClick={handleSignOut} colorScheme="red" leftIcon={<ExitIcon />}>
            Sign Out
          </Button>
        </HStack>

        <HStack spacing={4}>
          <Input
            placeholder="Search by name, surname, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="400px"
          />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="wholesale">Wholesale</option>
            <option value="reseller">Reseller</option>
            <option value="agent">Agent</option>
          </Select>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Address</Th>
                <Th>Cylinder</Th>
                <Th>Quantity</Th>
                <Th>Type</Th>
                <Th>Delivery</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCustomers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">
                        {customer.first_name} {customer.surname}
                      </Text>
                      <Badge size="sm" colorScheme={customer.gender === 'male' ? 'blue' : 'pink'}>
                        {customer.gender}
                      </Badge>
                    </VStack>
                  </Td>
                  <Td>{customer.phone_number}</Td>
                  <Td maxW="200px" isTruncated>{customer.physical_address}</Td>
                  <Td>{customer.cylinder_size}</Td>
                  <Td>{customer.quantity}</Td>
                  <Td>
                    <Badge colorScheme="green">
                      {customer.customer_type}
                    </Badge>
                  </Td>
                  <Td>
                    {customer.requires_delivery ? (
                      <Badge colorScheme="orange">Yes</Badge>
                    ) : (
                      <Badge colorScheme="gray">No</Badge>
                    )}
                  </Td>
                  <Td>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </Td>
                  <Td>
                    <HStack>
                      <IconButton
                        aria-label="Edit customer"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEdit(customer.id)}
                      />
                      <IconButton
                        aria-label="View details"
                        icon={<ViewIcon />}
                        size="sm"
                        colorScheme="gray"
                        onClick={() => router.push(`/customer/${customer.id}`)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {filteredCustomers.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">No customers found</Text>
          </Box>
        )}
      </VStack>
    </Container>
  )
}
