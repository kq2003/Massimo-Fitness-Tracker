// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { registerUser, loginUser, updateLocationConsent } from '@/services/api';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';

// export default function AuthPage() {
//     const [isRegister, setIsRegister] = useState(false);
//     const [formData, setFormData] = useState({ email: '', password: '', username: '' });
//     const [showConsentModal, setShowConsentModal] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log('Submitting form with data:', formData); // Log form data
//         try {
//             if (isRegister) {
//                 console.log('Registering user...');
//                 const response = await registerUser(formData);
//                 console.log('Register Response:', response.data); // Log backend response
//                 alert('User registered successfully! Please log in.');
//                 setIsRegister(false);
//             } else {
//                 console.log('Logging in user...');
//                 const response = await loginUser({ email: formData.email, password: formData.password });
//                 console.log('Login Response:', response.data); // Log backend response
//                 if (response.data.needsConsent) {
//                     console.log('Location consent required.');
//                     setShowConsentModal(true);
//                 } else {
//                     alert(response.data.message || 'Logged in successfully!');
//                     router.push('/menu');
//                 }
//             }
//         } catch (error: unknown) {
//             console.error('Error during form submission:', error); // Log error
//             if (error instanceof Error) {
//                 alert(error.message || 'An error occurred.');
//             } else {
//                 alert('An unknown error occurred.');
//             }
//         }
//     };

//     const handleConsent = async (consent: boolean) => {
//         console.log('Handling location consent:', consent); // Log consent choice
//         try {
//             const response = await updateLocationConsent(consent);
//             console.log('Consent Update Response:', response.data); // Log backend response
//             setShowConsentModal(false);
//             router.push('/menu');
//         } catch (error) {
//             console.error('Error updating location consent:', error); // Log error
//             alert('Failed to update location consent.');
//         }
//     };

//     return (
//         <div
//             className="flex items-center justify-center min-h-screen bg-gray-100"
//             style={{ backgroundImage: `url('/cbum.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//         >
//             <Card className="w-full max-w-md p-6">
//                 <h2 className="text-center mb-4 text-lg font-bold">
//                     {isRegister ? 'Register' : 'Log In'}
//                 </h2>
//                 <form className="space-y-4" onSubmit={handleSubmit}>
//                     {isRegister && (
//                         <Input
//                             placeholder="Username"
//                             onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                             required
//                         />
//                     )}
//                     <Input
//                         type="text"
//                         placeholder={isRegister ? 'Email' : 'Username or Email'}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         required
//                     />
//                     <Input
//                         type="password"
//                         placeholder="Password"
//                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                         required
//                     />
//                     <Button variant="default" className="w-full" type="submit">
//                         {isRegister ? 'Register' : 'Log In'}
//                     </Button>
//                 </form>
//                 <Button
//                     variant="link"
//                     className="w-full mt-2"
//                     onClick={() => setIsRegister(!isRegister)}
//                 >
//                     {isRegister ? 'Back to Login' : 'Create an Account'}
//                 </Button>
//             </Card>

//             {showConsentModal && (
//                 <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-4 rounded shadow-md">
//                         <h3 className="text-lg font-bold mb-4">Share Location Data?</h3>
//                         <div className="flex justify-around space-x-4">
//                             <Button variant="default" onClick={() => handleConsent(true)}>
//                                 Yes
//                             </Button>
//                             <Button variant="secondary" onClick={() => handleConsent(false)}>
//                                 No
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }





'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser, updateLocationConsent } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const [showConsentModal, setShowConsentModal] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form with data:', formData); // Log form data
        try {
            if (isRegister) {
                console.log('Registering user...');
                const response = await registerUser(formData);
                console.log('Register Response:', response.data); // Log backend response
                alert('User registered successfully! Please log in.');
                setIsRegister(false);
            } else {
                console.log('Logging in user...');
                const response = await loginUser({ email: formData.email, password: formData.password });
                console.log('Login Response:', response.data); // Log backend response
                if (response.data.needsConsent) {
                    console.log('Location consent required.');
                    setShowConsentModal(true);
                } else {
                    alert(response.data.message || 'Logged in successfully!');
                    router.push('/menu');
                }
            }
        } catch (error: unknown) {
            console.error('Error during form submission:', error); // Log error
            if (error instanceof Error) {
                alert(error.message || 'An error occurred.');
            } else {
                alert('An unknown error occurred.');
            }
        }
    };

    const handleConsent = async (consent: boolean) => {
        console.log('Handling location consent:', consent); // Log consent choice
        try {
            const response = await updateLocationConsent(consent);
            console.log('Consent Update Response:', response.data); // Log backend response
            setShowConsentModal(false);
            router.push('/menu');
        } catch (error) {
            console.error('Error updating location consent:', error); // Log error
            alert('Failed to update location consent.');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="/gym_video.mp4"
                autoPlay
                muted
                loop
            ></video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Auth Card */}
            <Card className="relative z-10 w-full max-w-md p-6">
                <div className="flex justify-center mb-4">
                    <img
                        src="/massimo-logo.png"
                        alt="Massimo Fitness Tracker"
                        className="h-22 w-22"
                    />
                </div>

                <h2 className="text-center mb-4 text-lg font-bold text-white">
                    {isRegister ? 'Register' : 'Log In'}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {isRegister && (
                        <Input
                            placeholder="Username"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    )}
                    <Input
                        type="text"
                        placeholder={isRegister ? 'Email' : 'Username or Email'}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <Button variant="default" className="w-full" type="submit">
                        {isRegister ? 'Register' : 'Log In'}
                    </Button>
                </form>
                <Button
                    variant="link"
                    className="w-full mt-2"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? 'Back to Login' : 'Create an Account'}
                </Button>
            </Card>

            {/* Consent Modal */}
            {showConsentModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h3 className="text-lg font-bold mb-4">Share Location Data?</h3>
                        <div className="flex justify-around space-x-4">
                            <Button variant="default" onClick={() => handleConsent(true)}>
                                Yes
                            </Button>
                            <Button variant="secondary" onClick={() => handleConsent(false)}>
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
