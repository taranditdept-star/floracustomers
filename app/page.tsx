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
  IconButton,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { EditIcon } from '@chakra-ui/icons'

export default function CustomerRegistrationForm() {
  const toast = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requiresDelivery, setRequiresDelivery] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    phoneNumber: '',
    gender: '',
    physicalAddress: '',
    familySize: '',
    cylinderSize: '',
    quantity: '',
    usageFrequency: '',
    customerType: '',
    paymentMethod: '',
    additionalNotes: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      const requiredFields = ['firstName', 'surname', 'phoneNumber', 'gender', 'physicalAddress', 'cylinderSize', 'quantity', 'customerType']
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
      
      if (missingFields.length > 0) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        return
      }

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('customers')
        .insert({
          first_name: formData.firstName,
          surname: formData.surname,
          phone_number: formData.phoneNumber,
          gender: formData.gender,
          physical_address: formData.physicalAddress,
          family_size: formData.familySize || null,
          cylinder_size: formData.cylinderSize,
          quantity: parseInt(formData.quantity),
          usage_frequency: formData.usageFrequency || null,
          customer_type: formData.customerType,
          payment_method: formData.paymentMethod || null,
          requires_delivery: requiresDelivery,
          additional_notes: formData.additionalNotes || null,
        })
        .select()

      if (error) {
        throw error
      }
      
      toast({
        title: 'Registration Successful!',
        description: `Customer ${formData.firstName} ${formData.surname} has been registered successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Reset form
      setFormData({
        firstName: '',
        surname: '',
        phoneNumber: '',
        gender: '',
        physicalAddress: '',
        familySize: '',
        cylinderSize: '',
        quantity: '',
        usageFrequency: '',
        customerType: '',
        paymentMethod: '',
        additionalNotes: '',
      })
      setRequiresDelivery(false)
    } catch (error: any) {
      console.error('Error registering customer:', error)
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error registering the customer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearForm = () => {
    setFormData({
      firstName: '',
      surname: '',
      phoneNumber: '',
      gender: '',
      physicalAddress: '',
      familySize: '',
      cylinderSize: '',
      quantity: '',
      usageFrequency: '',
      customerType: '',
      paymentMethod: '',
      additionalNotes: '',
    })
    setRequiresDelivery(false)
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <Box textAlign="left">
                <Heading size="lg" color="blue.600">
                  Flora Gas
                </Heading>
                <Text fontSize="xl" mt={2}>
                  Customer Registration Form
                </Text>
              </Box>
              <Button
                leftIcon={<EditIcon />}
                colorScheme="blue"
                variant="outline"
                onClick={() => router.push('/login')}
              >
                Staff Login
              </Button>
            </HStack>

            <form onSubmit={handleSubmit}>
              <Stack divider={<StackDivider />} spacing={6}>
                {/* Personal Information Section */}
                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Personal Information
                  </Heading>
                  <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="e.g., Tendai"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Surname</FormLabel>
                        <Input
                          name="surname"
                          value={formData.surname}
                          onChange={handleInputChange}
                          placeholder="e.g., Moyo"
                        />
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="e.g., 0771234567"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          placeholder="Select"
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
                        name="physicalAddress"
                        value={formData.physicalAddress}
                        onChange={handleInputChange}
                        placeholder="e.g., 14 Baines Ave, Harare"
                      />
                    </FormControl>
                  </VStack>
                </Box>

                {/* Household & Usage Section */}
                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Household & Usage
                  </Heading>
                  <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Family Size</FormLabel>
                        <Select
                          name="familySize"
                          value={formData.familySize}
                          onChange={handleInputChange}
                          placeholder="Select"
                        >
                          <option value="1-2">1-2 members</option>
                          <option value="3-4">3-4 members</option>
                          <option value="5-6">5-6 members</option>
                          <option value="7+">7+ members</option>
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Cylinder Size</FormLabel>
                        <Select
                          name="cylinderSize"
                          value={formData.cylinderSize}
                          onChange={handleInputChange}
                          placeholder="Select"
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
                          name="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="e.g., 2"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>How Often Do They Use Gas at Home?</FormLabel>
                        <Select
                          name="usageFrequency"
                          value={formData.usageFrequency}
                          onChange={handleInputChange}
                          placeholder="Select"
                        >
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

                {/* Customer Type & Preferences Section */}
                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Customer Type & Preferences
                  </Heading>
                  <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Customer Type</FormLabel>
                        <Select
                          name="customerType"
                          value={formData.customerType}
                          onChange={handleInputChange}
                          placeholder="Select"
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="wholesale">Wholesale</option>
                          <option value="reseller">Reseller</option>
                          <option value="agent">Agent</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Preferred Payment Method</FormLabel>
                        <Select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          placeholder="Select"
                        >
                          <option value="cash">Cash</option>
                          <option value="ecocash">Ecocash</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="credit">Credit</option>
                        </Select>
                      </FormControl>
                    </HStack>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="delivery-switch" mb="0">
                        Requires Delivery?
                      </FormLabel>
                      <Switch
                        id="delivery-switch"
                        isChecked={requiresDelivery}
                        onChange={(e) => setRequiresDelivery(e.target.checked)}
                      />
                    </FormControl>
                  </VStack>
                </Box>

                {/* Additional Notes Section */}
                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Additional Notes
                  </Heading>
                  <FormControl>
                    <FormLabel>
                      Capture Any Additional Customer Preferences or Remarks
                    </FormLabel>
                    <Textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="e.g., Prefers morning deliveries, interested in becoming a reseller in Kuwadzana..."
                      rows={4}
                    />
                  </FormControl>
                </Box>
              </Stack>

              <HStack spacing={4} mt={8} justify="center">
                <Button
                  variant="outline"
                  onClick={handleClearForm}
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText="Registering..."
                >
                  Register Customer
                </Button>
              </HStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
