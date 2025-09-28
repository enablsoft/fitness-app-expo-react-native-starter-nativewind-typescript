import * as React from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [verificationError, setVerificationError] = React.useState('')

  // Clear errors when user starts typing
  const clearErrors = () => {
    setErrorMessage('')
  }

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    setErrorMessage('')

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err: any) {
      // Handle specific Clerk errors
      if (err?.errors?.[0]?.code === 'form_password_pwned') {
        setErrorMessage('This password has been found in a data breach. Please choose a different, more secure password.')
      } else if (err?.errors?.[0]?.code === 'form_password_validation_failed') {
        setErrorMessage('Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.')
      } else if (err?.errors?.[0]?.code === 'form_identifier_exists') {
        setErrorMessage('An account with this email already exists. Please sign in instead.')
      } else if (err?.errors?.[0]?.code === 'form_identifier_invalid') {
        setErrorMessage('Please enter a valid email address.')
      } else {
        setErrorMessage(err?.errors?.[0]?.message || 'An error occurred during sign up. Please try again.')
      }
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    setVerificationError('')

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerificationError('Verification failed. Please check your code and try again.')
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err: any) {
      if (err?.errors?.[0]?.code === 'form_code_incorrect') {
        setVerificationError('Invalid verification code. Please check your email and try again.')
      } else {
        setVerificationError(err?.errors?.[0]?.message || 'Verification failed. Please try again.')
      }
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className='flex-1'
        >
          <View className='flex-1 px-6 justify-center'>
            <View className='items-center mb-8'>
              <View className='w-20 h-20 bg-gradient-to-br from-blue-800 to-pink-600 rounded-2xl items-center justify-center md-4 shadow-lg bg-gray-900 mb-3'>
                <Ionicons name="mail" size={40} color="white" />
              </View>
              <Text className='text-3xl font-bold text-gray-900 mb-2'>
                Verify Your Email
              </Text>
              <Text className='text-lg text-gray-600 text-center'>
                We've sent a verification code to {"\n"}{emailAddress}
              </Text>
            </View>

            <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
              <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                Enter Verification Code
              </Text>

              {verificationError ? (
                <View className='bg-red-50 border border-red-200 rounded-xl p-4 mb-4'>
                  <View className='flex-row items-center'>
                    <Ionicons name="alert-circle" size={20} color="#DC2626" />
                    <Text className='text-red-700 font-medium ml-2 flex-1'>
                      {verificationError}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Verification Code
                </Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons name="key-outline" size={20} color="#6B7280" />
                  <TextInput
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setCode}
                    className='flex-1 ml-3 text-gray-900 text-center text-lg font-mono'
                    editable={!isLoading}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={onVerifyPress}
                disabled={isLoading || !code.trim()}
                className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading || !code.trim() ? "bg-gray-400" : "bg-blue-600"}`}
                activeOpacity={0.8}
              >
                <View className='flex-row items-center justify-center'>
                  {isLoading ? (
                    <Ionicons name='refresh' size={20} color="white" />
                  ) : (
                    <Ionicons name='checkmark-circle-outline' size={20} color="white" />
                  )}
                  <Text className='text-white font-semibold text-lg ml-2'>
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPendingVerification(false)
                  setVerificationError('')
                  setCode('')
                }}
                className='py-2'
              >
                <Text className='text-blue-600 font-medium text-center'>
                  Back to Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50 mt-5'>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className='flex-1'
      >
        <View className='flex-1 px-6'>
          {/**Main */}
          <View className='flex-1 justify-center'>
            <View className='items-center mb-8'>
              <View className='w-20 h-20 bg-gradient-to-br from-blue-800 to-pink-600 rounded-2xl items-center justify-center md-4 shadow-lg bg-gray-900 mb-3'>
                <Ionicons name="fitness" size={40} color="white" />
              </View>
              <Text className='text-3xl font-bold text-gray-900 mb-2'>
                Join FitTracker
              </Text>
              <Text className='text-lg text-gray-600 text-center'>
                Track your fitness journey {"\n"} and reach your goals
              </Text>
            </View>

            {/** Sign Up Form */}
            <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
              <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                Create your Account
              </Text>

              {errorMessage ? (
                <View className='bg-red-50 border border-red-200 rounded-xl p-4 mb-6'>
                  <View className='flex-row items-center'>
                    <Ionicons name="alert-circle" size={20} color="#DC2626" />
                    <Text className='text-red-700 font-medium ml-2 flex-1'>
                      {errorMessage}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/** Email Input */}
              <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Email
                </Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  <TextInput
                    autoCapitalize='none'
                    value={emailAddress}
                    placeholder='Enter your email'
                    placeholderTextColor="#9CA3AF"
                    onChangeText={(text) => {
                      setEmailAddress(text)
                      clearErrors()
                    }}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/** Password Input */}
              <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Password
                </Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  <TextInput
                    value={password}
                    secureTextEntry={true}
                    placeholder='Enter your password'
                    placeholderTextColor="#9CA3AF"
                    onChangeText={(text) => {
                      setPassword(text)
                      clearErrors()
                    }}
                    className='flex-1 ml-3 text-gray-900'
                    editable={!isLoading}
                  />
                </View>
                <Text className='text-xs text-gray-500 mt-1'>
                  Must be at least 8 characters with letters, numbers, and symbols
                </Text>
              </View>

              {/** Sign In Input */}
              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isLoading}
                className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
                activeOpacity={0.8}
              >
                <View className='flex-row items-center justify-center'>
                  {isLoading ? (
                    <Ionicons name='refresh' size={20} color="white" />
                  ) : (
                    <Ionicons name='person-add-outline' size={20} color="white" />
                  )}
                  <Text className='text-white font-semibold text-lg ml-2'>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/** Terms */}
              <Text className='text-xs text-gray-500 text-center mb-4'>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>

            {/** Sign In Link */}
            <View className='flex-row justify-center items-center mt-4'>
              <Text className='text-gray-600'>Already have an account? </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text className='text-blue-600 font-semibold'>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/** Footer */}
          <View className='pb-6'>
            <Text className='text-center text-gray-500 text-sm'>
              Ready to transform your fitness?
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}