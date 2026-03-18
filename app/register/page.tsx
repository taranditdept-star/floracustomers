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
  SimpleGrid,
  Divider,
  Badge,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface Company {
  id: string
  name: string
  parent_company: string
  industry: string
}

interface FormData {
  firstName: string
  surname: string
  phoneNumber: string
  email: string
  physicalAddress: string
  // Flora Gas specific
  gender?: string
  familySize?: string
  cylinderSize?: string
  quantity?: string
  usageFrequency?: string
  customerType?: string
  paymentMethod?: string
  requiresDelivery?: boolean
  // Ecomatt Foods specific
  productType?: string
  orderFrequency?: string
  businessType?: string
  preferredDeliveryTime?: string
  // Generic
  additionalNotes?: string
}

export default function DynamicRegistrationForm() {
  const router = useRouter()
  const toast = useToast()
  const [user, setUser] = useState<any>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    surname: '',
    phoneNumber: '',
    email: '',
    physicalAddress: '',
    additionalNotes: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        *,
        companies(*)
      `)
      .eq('id', session.user.id)
      .single()
    
    if (!profile?.company_id) {
      toast({
        title: 'Access Denied',
        description: 'You are not assigned to any company',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/login')
      return
    }

    setUser({ ...session.user, ...profile })
    setCompany(profile.companies)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !company) return

    setIsSubmitting(true)

    try {
      // Prepare company-specific fields
      const companySpecificFields: any = {}

      if (company.name === 'Flora Gas') {
        companySpecificFields.gender = formData.gender
        companySpecificFields.family_size = formData.familySize
        companySpecificFields.cylinder_size = formData.cylinderSize
        companySpecificFields.quantity = parseInt(formData.quantity || '0')
        companySpecificFields.usage_frequency = formData.usageFrequency
        companySpecificFields.customer_type = formData.customerType
        companySpecificFields.payment_method = formData.paymentMethod
        companySpecificFields.requires_delivery = formData.requiresDelivery
      } else if (company.name === 'Ecomatt Foods') {
        companySpecificFields.product_type = formData.productType
        companySpecificFields.order_frequency = formData.orderFrequency
        companySpecificFields.business_type = formData.businessType
        companySpecificFields.preferred_delivery_time = formData.preferredDeliveryTime
      }

      const { error } = await supabase
        .from('customers')
        .insert({
          company_id: company.id,
          first_name: formData.firstName,
          surname: formData.surname,
          phone_number: formData.phoneNumber,
          email: formData.email,
          physical_address: formData.physicalAddress,
          company_specific_fields: companySpecificFields,
          created_by: user.id,
        })

      if (error) throw error

      toast({
        title: 'Registration Successful!',
        description: `Customer has been registered for ${company.name}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Reset form
      setFormData({
        firstName: '',
        surname: '',
        phoneNumber: '',
        email: '',
        physicalAddress: '',
        additionalNotes: '',
      })
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCompanySpecificFields = () => {
    if (!company) return null

    switch (company.name) {
      case 'Flora Gas':
        return (
          <>
            <Divider />
            <Box>
              <Heading size="md" mb={4} color="gray.700">
                Gas Order Details
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Family Size</FormLabel>
                  <Select name="familySize" value={formData.familySize} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="1-2">1-2 members</option>
                    <option value="3-4">3-4 members</option>
                    <option value="5-6">5-6 members</option>
                    <option value="7+">7+ members</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Cylinder Size</FormLabel>
                  <Select name="cylinderSize" value={formData.cylinderSize} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="3kg">3kg</option>
                    <option value="5kg">5kg</option>
                    <option value="9kg">9kg</option>
                    <option value="13kg">13kg</option>
                    <option value="19kg">19kg</option>
                    <option value="48kg">48kg</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Number of cylinders"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>
          </>
        )

      case 'Ecomatt Foods':
        return (
          <>
            <Divider />
            <Box>
              <Heading size="md" mb={4} color="gray.700">
                Order Details
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Product Type</FormLabel>
                  <Select name="productType" value={formData.productType} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="roller-meal">Roller Meal</option>
                    <option value="maize-flour">Maize Flour</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Order Frequency</FormLabel>
                  <Select name="orderFrequency" value={formData.orderFrequency} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Business Type</FormLabel>
                  <Select name="businessType" value={formData.businessType} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="individual">Individual</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Preferred Delivery Time</FormLabel>
                  <Select name="preferredDeliveryTime" value={formData.preferredDeliveryTime} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="morning">Morning (6AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-6PM)</option>
                    <option value="evening">Evening (6PM-9PM)</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
            </Box>
          </>
        )

      default:
        return null
    }
  }

  if (!company) {
    return <Container maxW="container.md" py={8}>Loading...</Container>
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="blue.600">
                {company.name}
              </Heading>
              <Text fontSize="xl" mt={2}>
                Customer Registration Form
              </Text>
              <Badge mt={2} colorScheme="green">
                {company.industry}
              </Badge>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack divider={<StackDivider />} spacing={6}>
                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Customer Information
                  </Heading>
                  <VStack spacing={4}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="e.g., John"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Surname</FormLabel>
                        <Input
                          name="surname"
                          value={formData.surname}
                          onChange={handleInputChange}
                          placeholder="e.g., Doe"
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="+263 7XX XXX XXX"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="customer@example.com"
                        />
                      </FormControl>
                    </SimpleGrid>
                    <FormControl isRequired>
                      <FormLabel>Physical Address</FormLabel>
                      <Input
                        name="physicalAddress"
                        value={formData.physicalAddress}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, Harare"
                      />
                    </FormControl>
                  </VStack>
                </Box>

                {renderCompanySpecificFields()}

                <Box>
                  <Heading size="md" mb={4} color="gray.700">
                    Additional Information
                  </Heading>
                  <FormControl>
                    <FormLabel>Additional Notes</FormLabel>
                    <Textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any additional information..."
                    />
                  </FormControl>
                </Box>
              </Stack>

              <HStack spacing={4} mt={8} justify="center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/crm')}
                >
                  Back to Dashboard
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
