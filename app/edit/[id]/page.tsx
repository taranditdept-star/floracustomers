'use client'

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Switch,
  Textarea,
  VStack,
  useToast,
  Text,
  HStack,
  Card,
  CardBody,
  Stack,
  StackDivider,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

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
}

export default function EditCustomerPage() {
  const params = useParams()
  const customerId = params.id as string
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) throw error
      setCustomer(data)
    } catch (error: any) {
      toast({
        title: 'Error fetching customer',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer) return

    setSaving(true)

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: customer.first_name,
          surname: customer.surname,
          phone_number: customer.phone_number,
          gender: customer.gender,
          physical_address: customer.physical_address,
          family_size: customer.family_size,
          cylinder_size: customer.cylinder_size,
          quantity: customer.quantity,
          usage_frequency: customer.usage_frequency,
          customer_type: customer.customer_type,
          payment_method: customer.payment_method,
          requires_delivery: customer.requires_delivery,
          additional_notes: customer.additional_notes,
        })
        .eq('id', customerId)

      if (error) throw error

      toast({
        title: 'Customer Updated!',
        description: 'Customer information has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Loading...</Text>
      </Container>
    )
  }

  if (!customer) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Customer not found</Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="blue.600">
                Edit Customer
              </Heading>
              <Text fontSize="md" mt={2}>
                {customer.first_name} {customer.surname}
              </Text>
            </Box>

            <form onSubmit={handleUpdate}>
              <Stack divider={<StackDivider />} spacing={6}>
                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Personal Information
                  </Heading>
                  <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          value={customer.first_name}
                          onChange={(e) => setCustomer({...customer, first_name: e.target.value})}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Surname</FormLabel>
                        <Input
                          value={customer.surname}
                          onChange={(e) => setCustomer({...customer, surname: e.target.value})}
                        />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          value={customer.phone_number}
                          onChange={(e) => setCustomer({...customer, phone_number: e.target.value})}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          value={customer.gender}
                          onChange={(e) => setCustomer({...customer, gender: e.target.value})}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Select>
                      </FormControl>
                    </HStack>
                    <FormControl isRequired>
                      <FormLabel>Physical Address</FormLabel>
                      <Input
                        value={customer.physical_address}
                        onChange={(e) => setCustomer({...customer, physical_address: e.target.value})}
                      />
                    </FormControl>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Order Details
                  </Heading>
                  <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Family Size</FormLabel>
                        <Select
                          value={customer.family_size || ''}
                          onChange={(e) => setCustomer({...customer, family_size: e.target.value})}
                        >
                          <option value="">Select</option>
                          <option value="1-2">1-2 members</option>
                          <option value="3-4">3-4 members</option>
                          <option value="5-6">5-6 members</option>
                          <option value="7+">7+ members</option>
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Cylinder Size</FormLabel>
                        <Select
                          value={customer.cylinder_size}
                          onChange={(e) => setCustomer({...customer, cylinder_size: e.target.value})}
                        >
                          <option value="3kg">3kg</option>
                          <option value="5kg">5kg</option>
                          <option value="9kg">9kg</option>
                          <option value="13kg">13kg</option>
                          <option value="19kg">19kg</option>
                          <option value="48kg">48kg</option>
                        </Select>
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="number"
                          value={customer.quantity}
                          onChange={(e) => setCustomer({...customer, quantity: parseInt(e.target.value)})}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Usage Frequency</FormLabel>
                        <Select
                          value={customer.usage_frequency || ''}
                          onChange={(e) => setCustomer({...customer, usage_frequency: e.target.value})}
                        >
                          <option value="">Select</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="occasionally">Occasionally</option>
                        </Select>
                      </FormControl>
                    </HStack>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Preferences
                  </Heading>
                  <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Customer Type</FormLabel>
                        <Select
                          value={customer.customer_type}
                          onChange={(e) => setCustomer({...customer, customer_type: e.target.value})}
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="wholesale">Wholesale</option>
                          <option value="reseller">Reseller</option>
                          <option value="agent">Agent</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          value={customer.payment_method || ''}
                          onChange={(e) => setCustomer({...customer, payment_method: e.target.value})}
                        >
                          <option value="">Select</option>
                          <option value="cash">Cash</option>
                          <option value="ecocash">Ecocash</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="credit">Credit</option>
                        </Select>
                      </FormControl>
                    </HStack>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">Requires Delivery?</FormLabel>
                      <Switch
                        isChecked={customer.requires_delivery}
                        onChange={(e) => setCustomer({...customer, requires_delivery: e.target.checked})}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Additional Notes</FormLabel>
                      <Textarea
                        value={customer.additional_notes || ''}
                        onChange={(e) => setCustomer({...customer, additional_notes: e.target.value})}
                        rows={4}
                      />
                    </FormControl>
                  </VStack>
                </Box>
              </Stack>

              <HStack spacing={4} mt={8} justify="center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={saving}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </HStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
