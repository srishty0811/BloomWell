// ---- FULL Signup.jsx ----
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        gender: '',
        bio: '',
        age: ''
    });

    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [missingDetailsError, setMissingDetailsError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['username', 'password', 'name', 'email', 'gender', 'age'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            setMissingDetailsError('Please fill in all required fields.');
            return;
        }

        try {
            const formDataWithFile = new FormData();
            for (const key in formData) {
                formDataWithFile.append(key, formData[key]);
            }
            if (profilePicture) {
                formDataWithFile.append('profilePicture', profilePicture);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                body: formDataWithFile,
            });

            if (response.status === 409) {
                const data = await response.json();
                setError(data.msg);
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Signup successful:', data);

            setSuccessMessage("Signup successful! Redirecting to login...");
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Error signing up:', error);
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pt-20 bg-gradient-to-r from-zinc-50 to-red-100 min-h-screen">

            {successMessage && (
                <p className="text-center text-green-600 font-bold mb-4">{successMessage}</p>
            )}

            {error && (
                <p className="text-center text-red-600 font-bold mb-4">{error}</p>
            )}

            {missingDetailsError && (
                <p className="text-center text-red-600 font-bold mb-4">{missingDetailsError}</p>
            )}

            <form onSubmit={handleSubmit} className='max-w-3xl mx-auto'>
                <h2 className="text-2xl font-bold text-center mb-8">Signup</h2>

                <label className="block text-sm font-medium text-gray-900">Profile Picture</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
                        <input type="file" onChange={handleFileChange} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="border p-2 rounded" />

                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 rounded" />

                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="border p-2 rounded" />

                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded" />

                    <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non Binary">Non Binary</option>
                    </select>

                    <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="border p-2 rounded" />
                </div>

                <textarea name="bio" placeholder="Tell us something about yourself"
                    value={formData.bio} onChange={handleChange}
                    className="border p-3 rounded w-full mt-4" />

                <div className="mt-8 flex justify-center gap-x-6">
                    <button type="button" className="px-6 py-3 bg-gray-300 rounded">Cancel</button>

                    <button type="submit"
                        className="rounded bg-indigo-600 px-8 py-3 text-white font-bold hover:bg-indigo-500">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
// ---- END ----
