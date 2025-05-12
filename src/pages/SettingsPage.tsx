// src/pages/SettingsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // For reading tab state
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  UserCircle,
  Home,
  Lock,
  Edit,
  Plus,
  Trash,
  Camera,
} from 'lucide-react'; // Added Camera
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  updateMe,
  updateMyPassword,
  UpdateMePayload,
  UpdatePasswordPayload,
} from '@/services/authService'; // For profile & password
import {
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
  ApiErrorResponse,
} from '@/services/addressService';

// --- Zod Schemas ---
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  // photo: z.any().optional(), // For file upload later
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required.'),
    password: z.string().min(6, 'New password must be at least 6 characters.'),
    passwordConfirm: z.string().min(6, 'Password confirmation is required.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'New passwords do not match.',
    path: ['passwordConfirm'],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

const addressSchema = z.object({
  name: z.string().min(2, 'Name/Label is required (e.g., Home, Work).'),
  address_line1: z.string().min(5, 'Address Line 1 is required.'),
  address_line2: z.string().optional().nullable(),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  postal_code: z.string().min(5, 'Postal code is required.').max(10),
  country: z.string().min(2, 'Country is required.'),
  is_primary: z.boolean().optional(),
});
type AddressFormValues = z.infer<typeof addressSchema>;

const defaultAddressFormValues: Omit<AddressFormValues, 'name'> & {
  name?: string;
} = {
  // name is optional here for reset
  address_line1: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'India',
  is_primary: false,
};

// Zod schema for updating password (when logged in)
const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters.'),
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "New passwords don't match.",
    path: ['newPasswordConfirm'],
  });
type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export default function SettingsPage() {
  const { user, checkAuthStatus } = useAuth(); // checkAuthStatus to refresh user data after update
  const location = useLocation();
  const defaultTabFromState = location.state?.defaultTab || 'profile';

  const updatePasswordForm = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const onUpdatePasswordSubmit = async (data: UpdatePasswordFormValues) => {
    updatePasswordForm.clearErrors(); // Clear previous errors
    try {
      const payload: UpdatePasswordPayload = {
        currentPassword: data.currentPassword,
        password: data.newPassword, // Ensure your backend expects 'password'
        passwordConfirm: data.newPasswordConfirm, // Ensure your backend expects 'passwordConfirm'
      };
      await updateMyPassword(payload);
      toast.success('Password updated successfully!');
      updatePasswordForm.reset(); // Reset form
      // Backend's updatePassword controller calls createSendToken, which sets a new cookie.
      // Optionally, you can call checkAuthStatus() from AuthContext to refresh user if needed,
      // though the cookie update should be sufficient for subsequent requests.
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Failed to update password.');
      // Optionally set form errors:
      if (apiError.message?.toLowerCase().includes('wrong old password')) {
        updatePasswordForm.setError('currentPassword', {
          type: 'manual',
          message: apiError.message,
        });
      } else {
        updatePasswordForm.setError('root', {
          type: 'manual',
          message: apiError.message || 'An unexpected error occurred.',
        });
      }
      console.error('Update password error:', apiError);
    }
  };

  // Profile State & Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    setValue: setProfileValue, // To set initial values
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

  // Password State & Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  // Address State & Form
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const {
    control: addressControl,
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    formState: { errors: addressErrors, isSubmitting: isAddressFormSubmitting },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema) });

  // --- Effects ---
  useEffect(() => {
    // Pre-fill profile form
    if (user) {
      setProfileValue('name', user.name || '');
      setProfileValue('email', user.email || '');
    }
  }, [user, setProfileValue]);

  // const fetchAddresses = useCallback(async () => {
  //   if (!user) return;
  //   setIsLoadingAddresses(true);
  //   try {
  //     const response = await getMyAddresses();
  //     setAddresses(response.data.addresses || []);
  //   } catch (error) {
  //     toast.error(
  //       (error as ApiErrorResponse).message || 'Failed to load addresses.'
  //     );
  //   } finally {
  //     setIsLoadingAddresses(false);
  //   }
  // }, [user]);

  // src/pages/SettingsPage.tsx
  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    setIsLoadingAddresses(true);
    try {
      const response = await getMyAddresses(); // This is ApiResponse<{ addresses: Address[] }>

      if (response && response.data && Array.isArray(response.data.addresses)) {
        setAddresses(response.data.addresses);
      } else {
        console.error(
          'SettingsPage: Address data is not in expected structure.',
          response
        );
        setAddresses([]);
        toast.error('Could not load addresses: Invalid data format.');
      }
    } catch (error) {
      /* ... */
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user]);
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // --- Profile Handlers ---
  const onSubmitProfile = async (data: ProfileFormValues) => {
    try {
      const payload: UpdateMePayload = { name: data.name, email: data.email };
      await updateMe(payload);
      toast.success('Profile updated successfully!');
      await checkAuthStatus(); // Refresh user in AuthContext and localStorage
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message || 'Failed to update profile.'
      );
    }
  };

  // --- Password Handlers ---
  const onSubmitPassword = async (data: PasswordFormValues) => {
    try {
      await updateMyPassword({
        currentPassword: data.currentPassword,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });
      toast.success('Password updated successfully! You might be logged out.');
      resetPassword();
      // Optionally, force logout or re-login if backend invalidates session
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message || 'Failed to update password.'
      );
    }
  };

  // --- Address Handlers ---
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    resetAddress({
      ...defaultAddressFormValues,
      name: `Address for ${user?.name || 'User'}`,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditModal = (address: Address) => {
    setEditingAddress(address);
    resetAddress({
      name: address.name || `Address for ${user?.name || 'User'}`,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_primary: address.is_primary,
    });
    setIsAddressModalOpen(true);
  };

  const onSubmitAddressForm = async (data: AddressFormValues) => {
    try {
      const payload: CreateAddressPayload | UpdateAddressPayload = {
        ...data,
        address_line2: data.address_line2 || null,
      };
      if (editingAddress) {
        await updateMyAddress(
          editingAddress.id,
          payload as UpdateAddressPayload
        );
        toast.success('Address updated!');
      } else {
        await addMyAddress(payload as CreateAddressPayload);
        toast.success('Address added!');
      }
      await fetchAddresses();
      setIsAddressModalOpen(false);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message || 'Failed to save address.'
      );
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Delete this address?')) {
      try {
        await deleteMyAddress(addressId);
        toast.success('Address deleted!');
        await fetchAddresses();
      } catch (error) {
        toast.error(
          (error as ApiErrorResponse).message || 'Failed to delete address.'
        );
      }
    }
  };

  const handleSetPrimary = async (addressId: string) => {
    try {
      await updateMyAddress(addressId, { is_primary: true });
      toast.success('Primary address updated!');
      await fetchAddresses();
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message || 'Failed to set primary.'
      );
    }
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1 py-8'>
        <div className='container mx-auto px-4'>
          <h1 className='mb-8 text-2xl font-bold text-kisan-primary md:text-3xl'>
            Account Settings
          </h1>

          <Tabs defaultValue={defaultTabFromState} className='w-full'>
            <TabsList className='mb-8 grid w-full grid-cols-3'>
              {' '}
              {/* Removed Payment Tab */}
              <TabsTrigger value='profile'>Profile</TabsTrigger>
              <TabsTrigger value='addresses'>Addresses</TabsTrigger>
              <TabsTrigger value='security'>Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value='profile'>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your name and email.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                  <CardContent className='space-y-6'>
                    <div className='flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0'>
                      <div className='relative'>
                        <div className='h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-kisan-primary/20'>
                          {/* TODO: Add actual user photo if available, or use initial */}
                          {user?.name ? (
                            <span className='text-3xl font-semibold text-kisan-primary'>
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <UserCircle className='h-12 w-12 text-gray-400' />
                          )}
                        </div>
                        <Button
                          type='button'
                          size='icon'
                          variant='outline'
                          className='absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border-kisan-primary text-kisan-primary'
                          onClick={() =>
                            toast.info('Photo upload coming soon!')
                          }
                        >
                          <Camera className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='flex-1 space-y-4 w-full'>
                        <div>
                          <Label htmlFor='profileName'>Full Name</Label>
                          <Input
                            id='profileName'
                            {...registerProfile('name')}
                            placeholder='Your full name'
                          />
                          {profileErrors.name && (
                            <p className='text-xs text-red-500 mt-1'>
                              {profileErrors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor='profileEmail'>Email</Label>
                          <Input
                            id='profileEmail'
                            type='email'
                            {...registerProfile('email')}
                            placeholder='Your email address'
                          />
                          {profileErrors.email && (
                            <p className='text-xs text-red-500 mt-1'>
                              {profileErrors.email.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            readOnly
                            value={user?.role || 'N/A'}
                            className='bg-gray-100 cursor-not-allowed'
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-end space-x-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() =>
                        resetProfile({
                          name: user?.name || '',
                          email: user?.email || '',
                        })
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      disabled={isProfileSubmitting}
                      className='bg-kisan-primary text-white hover:bg-kisan-primary/90'
                    >
                      {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value='addresses'>
              <Card>
                <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                  <div>
                    <CardTitle>Your Addresses</CardTitle>
                    <CardDescription>
                      Manage your delivery addresses.
                    </CardDescription>
                  </div>
                  <Button className='mt-4 sm:mt-0' onClick={handleOpenAddModal}>
                    <Plus className='mr-1 h-4 w-4' /> Add New Address
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingAddresses ? (
                    <p>Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <p className='text-center text-gray-500 py-8'>
                      No addresses saved. Add one!
                    </p>
                  ) : (
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`rounded-lg border ${
                            address.is_primary
                              ? 'border-kisan-accent bg-kisan-accent/5'
                              : 'border-gray-200'
                          } p-4 flex flex-col justify-between`}
                        >
                          <div>
                            <div className='mb-2 flex items-start justify-between'>
                              <div className='flex items-center'>
                                <Home className='mr-2 h-4 w-4 text-kisan-primary' />
                                <h3 className='text-sm font-medium text-kisan-primary'>
                                  {address.name || 'Delivery Address'}
                                </h3>
                              </div>
                              {address.is_primary && (
                                <span className='rounded-full bg-kisan-accent/20 px-2 py-0.5 text-xs font-medium text-kisan-accent'>
                                  Default
                                </span>
                              )}
                            </div>
                            <div className='space-y-0.5 text-xs text-gray-600'>
                              <p>{address.address_line1}</p>
                              {address.address_line2 && (
                                <p>{address.address_line2}</p>
                              )}
                              <p>
                                {address.city}, {address.state}{' '}
                                {address.postal_code}
                              </p>
                              <p>{address.country}</p>
                              {/* Phone removed from display */}
                            </div>
                          </div>
                          <div className='mt-3 flex items-center space-x-1 sm:space-x-2 flex-wrap gap-1'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleOpenEditModal(address)}
                            >
                              <Edit className='mr-1 h-3 w-3' /> Edit
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              className='text-red-500 hover:text-red-700'
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash className='mr-1 h-3 w-3' /> Delete
                            </Button>
                            {!address.is_primary && (
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-xs text-kisan-primary hover:bg-kisan-primary/10 px-1.5 sm:px-2'
                                onClick={() => handleSetPrimary(address.id)}
                              >
                                Set Default
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value='security'>
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Update your password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                  <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium text-kisan-primary'>
                        Change Password
                      </h3>
                      <div>
                        <Label htmlFor='currentPassword'>
                          Current Password
                        </Label>
                        <Input
                          id='currentPassword'
                          type='password'
                          {...registerPassword('currentPassword')}
                          placeholder='Enter your current password'
                        />
                        {passwordErrors.currentPassword && (
                          <p className='text-xs text-red-500 mt-1'>
                            {passwordErrors.currentPassword.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor='newPassword'>New Password</Label>
                        <Input
                          id='newPassword'
                          type='password'
                          {...registerPassword('password')}
                          placeholder='Enter your new password'
                        />
                        {passwordErrors.password && (
                          <p className='text-xs text-red-500 mt-1'>
                            {passwordErrors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor='confirmPassword'>
                          Confirm New Password
                        </Label>
                        <Input
                          id='confirmPassword'
                          type='password'
                          {...registerPassword('passwordConfirm')}
                          placeholder='Confirm your new password'
                        />
                        {passwordErrors.passwordConfirm && (
                          <p className='text-xs text-red-500 mt-1'>
                            {passwordErrors.passwordConfirm.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Placeholder for 2FA and Login Activity */}
                    <div className='border-t border-gray-200 pt-6'>
                      <h3 className='text-lg font-medium text-kisan-primary mb-4'>
                        Two-Factor Authentication
                      </h3>
                      <div className='flex items-center justify-between rounded-lg border border-gray-200 p-4'>
                        <p className='text-sm text-gray-600'>
                          Enhance security with 2FA (Coming Soon).
                        </p>
                        <Button variant='outline' disabled>
                          Enable
                        </Button>
                      </div>
                    </div>
                    <div className='border-t border-gray-200 pt-6'>
                      <h3 className='text-lg font-medium text-kisan-primary mb-4'>
                        Login Activity
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Login activity details (Coming Soon).
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between items-center'>
                    {' '}
                    {/* Changed flex layout */}
                    <div>
                      {' '}
                      {/* Placeholder for other actions like logout from all devices */}
                      <Button
                        type='button'
                        variant='outline'
                        className='text-red-500 hover:text-red-700'
                        onClick={() =>
                          toast.info('Logout from all devices: Coming soon!')
                        }
                      >
                        Log out all devices
                      </Button>
                    </div>
                    <Button
                      type='submit'
                      disabled={isPasswordSubmitting}
                      className='bg-kisan-primary text-white hover:bg-kisan-primary/90'
                    >
                      <Lock className='mr-1 h-4 w-4' />{' '}
                      {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add/Edit Address Modal */}
        <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
          <DialogContent className='sm:max-w-[525px] p-0'>
            {' '}
            {/* Remove padding here, add to children */}
            <DialogHeader className='p-6 pb-4'>
              {' '}
              {/* Add padding here */}
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                Enter your delivery address details here. Fields marked with *
                are required.
              </DialogDescription>
            </DialogHeader>
            {/* Add max-h and overflow-y-auto to the form's parent div if content is too long */}
            <div className='max-h-[75vh] overflow-y-auto px-6'>
              {' '}
              {/* Scrollable area */}
              <form
                onSubmit={handleSubmitAddress(onSubmitAddressForm)}
                className='space-y-3 pb-2'
              >
                {' '}
                {/* Reduced space-y */}
                <div>
                  <Label htmlFor='modalName'>Full Name / Label*</Label>
                  <Input
                    id='modalName'
                    {...registerAddress('name')}
                    placeholder='e.g., Home, Work, John Doe'
                  />
                  {addressErrors.name && (
                    <p className='text-xs text-red-500 mt-1'>
                      {addressErrors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='modalAddress1'>Address Line 1*</Label>
                  <Textarea
                    id='modalAddress1'
                    {...registerAddress('address_line1')}
                    placeholder='Street address, P.O. box'
                  />
                  {addressErrors.address_line1 && (
                    <p className='text-xs text-red-500 mt-1'>
                      {addressErrors.address_line1.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='modalAddress2'>
                    Address Line 2 (Optional)
                  </Label>
                  <Textarea
                    id='modalAddress2'
                    {...registerAddress('address_line2')}
                    placeholder='Apartment, suite, unit'
                  />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <Label htmlFor='modalCity'>City*</Label>
                    <Input id='modalCity' {...registerAddress('city')} />
                    {addressErrors.city && (
                      <p className='text-xs text-red-500 mt-1'>
                        {addressErrors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='modalState'>State / Province*</Label>
                    <Input id='modalState' {...registerAddress('state')} />
                    {addressErrors.state && (
                      <p className='text-xs text-red-500 mt-1'>
                        {addressErrors.state.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <Label htmlFor='modalPostalCode'>Postal Code*</Label>
                    <Input
                      id='modalPostalCode'
                      {...registerAddress('postal_code')}
                    />
                    {addressErrors.postal_code && (
                      <p className='text-xs text-red-500 mt-1'>
                        {addressErrors.postal_code.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='modalCountry'>Country*</Label>
                    <Input id='modalCountry' {...registerAddress('country')} />
                    {addressErrors.country && (
                      <p className='text-xs text-red-500 mt-1'>
                        {addressErrors.country.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-center space-x-2 pt-2'>
                  <Controller
                    name='is_primary'
                    control={addressControl}
                    render={({ field }) => (
                      <Checkbox
                        id='modalIsPrimary'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor='modalIsPrimary'
                    className='text-sm font-normal'
                  >
                    Make this my default address
                  </Label>
                </div>
              </form>
            </div>
            <DialogFooter className='p-6 pt-4 border-t'>
              {' '}
              {/* Add padding and border here */}
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </DialogClose>
              {/* Use the form's submit handler for the save button */}
              <Button
                type='button'
                onClick={handleSubmitAddress(onSubmitAddressForm)}
                disabled={isAddressFormSubmitting}
                className='bg-kisan-primary text-white hover:bg-kisan-primary/90'
              >
                {isAddressFormSubmitting
                  ? editingAddress
                    ? 'Saving...'
                    : 'Adding...'
                  : editingAddress
                  ? 'Save Changes'
                  : 'Add Address'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
