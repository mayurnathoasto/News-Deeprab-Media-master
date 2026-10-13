'use client'
import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import Image from 'next/image'
import porfileSectImg from '../../assets/Images/Profile.svg'
import { FaCamera } from 'react-icons/fa'
import { currentLangCode, defaultLanguageCode, placeholderImage, resizeImageFixed } from '@/utils/helpers'
import { translate } from '@/utils/translation'
import { useRouter } from 'next/router'
import { setUserData, userDataSelector, userNameSelector } from '../store/reducers/userReducer'
import { useSelector } from 'react-redux'
import usersvg from '../../assets/Images/user.svg'
import validator from 'validator'
import { becomeAnAuthorApi, updateProfileApi } from '@/utils/api/api'
import toast from 'react-hot-toast'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { MdOutlineVerified } from 'react-icons/md'

const ProfileUpdate = () => {

    const currLangCode = currentLangCode();
    const defaultLangCode = defaultLanguageCode();
    const router = useRouter()
    const userData = useSelector(userDataSelector)
    const [isMobileValid, setIsMobileValid] = useState(true) // State to track mobile number validity
    const [isEmailValid, setIsEmailValid] = useState(true) // State to track email address validity

    const userName = useSelector(userNameSelector)
    const userAuthorData = useSelector(state => state?.user?.userManageData) // TODO: Double user state in redux, check it later

    const [pendingAuthorRequest, setPendingAuthorRequest] = useState(false)

    // profile data states are used from redux userManageData state
    const [profileData, setProfileData] = useState({
        name: '',
        mobile: '',
        email: '',
        isAuthor: '',
        authorReviewStatus: '', // 0 = pending, 1 = approved
        bio: '',
        telegram: '',
        whatsapp: '',
        facebook: '',
        linkedin: '',
    })

    useEffect(() => {
        if (userAuthorData?.data?.author?.status === "pending") {
            setPendingAuthorRequest(true)
        } else if (userAuthorData?.data?.author?.status === "rejected") {
            setPendingAuthorRequest(false)
        }
        if (userAuthorData?.data) {
            const showBioAndSocial = userAuthorData?.data?.author?.status === "approved" && userAuthorData?.data?.is_author === 1;
            setProfileData({
                name: userAuthorData.data.name || '',
                mobile: userAuthorData.data.mobile || '',
                email: userAuthorData.data.email || '',
                isAuthor: userAuthorData.data.is_author || 0,
                authorReviewStatus: userAuthorData.data.author?.status === "pending" ? "0" : "1",
                bio: showBioAndSocial ? userAuthorData.data?.author.bio || '' : '',
                telegram: showBioAndSocial ? userAuthorData.data?.author.telegram_link || '' : '',
                whatsapp: showBioAndSocial ? userAuthorData.data?.author.whatsapp_link || '' : '',
                facebook: showBioAndSocial ? userAuthorData.data?.author.facebook_link || '' : '',
                linkedin: showBioAndSocial ? userAuthorData.data?.author.linkedin_link || '' : '',
            })
        }
    }, [userAuthorData?.data])


    // handle profile change
    const handleImageChange = async e => {
        e.preventDefault()
        const selectedFile = e.target.files[0]
        // Check if a file is selected
        if (!selectedFile) {
            return
        }
        
        let imageToUpload = selectedFile;

        // Only resize if file is larger than 2MB (camera photos are usually much larger)
        const FILE_SIZE_THRESHOLD = 2 * 1024 * 1024; // 2MB

        if (selectedFile.size > FILE_SIZE_THRESHOLD) {
            imageToUpload = await resizeImageFixed(selectedFile, 96, 96, 1);
            // console.log('Large image resized:', selectedFile.size, '->', imageToUpload?.size);
        }

        // Check if the selected file type is an image
        if (!selectedFile.type.startsWith('image/')) {
            toast.error(translate('pleaseSelectImageFile'))
            return
        }

        if (!JSON.parse(process.env.NEXT_PUBLIC_DEMO)) {

            // setProfileData(prevState => ({ ...prevState, image: selectedFile }))
            try {
                const { data } = await updateProfileApi.updateProfile({
                    image: imageToUpload
                })
                setUserData({ data: data?.data, profileUpdate: false, profileImageUpdate: true })
            } catch (error) {
                toast.error(error)
            }
        }
    }

    const handleChange = e => {
        const field_name = e.target.name
        const field_value = e.target.value
        setProfileData(values => ({ ...values, [field_name]: field_value }))
    }

    // validate
    const validateNumber = e => {
        const enteredValue = e.target.value

        // Check if the entered value is an empty string
        if (enteredValue === '') {
            // If the mobile number is removed, set the 'mobile' field in 'profileData' to null
            setProfileData(prevState => ({ ...prevState, mobile: null }))
            setIsMobileValid(true) // Reset the mobile number validity when it's empty
        } else {
            // Otherwise, update the 'mobile' field with the entered value
            setProfileData(prevState => ({ ...prevState, mobile: enteredValue }))

            // Validate mobile if the entered value is not empty
            setIsMobileValid(validator.isMobilePhone(enteredValue)) // Set the mobile number validity flag
        }
    }

    const validateEmail = e => {
        const enteredValue = e.target.value

        // Check if the entered value is an empty string
        if (enteredValue === '') {
            // If the email address is removed, set the 'email' field in 'profileData' to null
            setProfileData(prevState => ({ ...prevState, email: null }))
            setIsEmailValid(true) // Reset the email address validity when it's empty
        } else {
            // Otherwise, update the 'email' field with the entered value
            setProfileData(prevState => ({ ...prevState, email: enteredValue }))

            // Validate email if the entered value is not empty
            setIsEmailValid(validator.isEmail(enteredValue)) // Set the email address validity flag
        }
    }

    // update profile button
    const formDetails = async e => {
        e.preventDefault()

        if (profileData?.name === '') {
            toast.error(translate('nameRequired'))
            return
        }

        // Validate email only when it's not empty
        if (!isEmailValid) {
            toast.error(translate('emailValid'))
            return
        }

        // Validate mobile only when it's not empty
        if (!isMobileValid) {
            toast.error(translate('mblValid'))
            return
        }

        if (!JSON.parse(process.env.NEXT_PUBLIC_DEMO)) {
            try {
                // First, update the profile with bio and social media links
                const { data } = await updateProfileApi.updateProfile({
                    name: profileData.name,
                    mobile: profileData.mobile,
                    email: profileData.email,
                    bio: profileData.bio,
                    telegram_link: profileData.telegram,
                    whatsapp_link: profileData.whatsapp,
                    facebook_link: profileData.facebook,
                    linkedin_link: profileData.linkedin,
                })

                if (!data?.error) {
                    setUserData({ data: data?.data, profileUpdate: true, profileImageUpdate: false })
                    toast.success(translate('profileUpdateMsg'))
                    // If user had clicked "Become Author", now call the become author API
                    if (pendingAuthorRequest) {
                        try {
                            const authorResponse = await becomeAnAuthorApi.becomeAnAuthor({})
                            if (!authorResponse?.data?.error) {
                                toast.success(translate('authorRequestSuccessMsg'))
                                setProfileData(prevState => ({
                                    ...prevState,
                                    isAuthor: 0,
                                    authorReviewStatus: "0"
                                }))
                                setPendingAuthorRequest(false) // Reset the pending state
                            } else {
                                toast.error(authorResponse?.data?.message)
                            }
                        } catch (authorError) {
                            toast.error(translate('somethingMSg'))
                            console.error(authorError)
                        }
                    }


                    userData?.data?.is_login === "0" ? router.push(`/${currLangCode}/user-based-categories`) : router.push(`/${currLangCode ? currLangCode : defaultLangCode}`);
                }
                else {
                    console.log(data?.message)
                }
            } catch (error) {
                toast.error(error)
            }

        } else {
            toast.error(translate('Profile update is not allowed in demo version.'))
            router.push(`/${currLangCode ? currLangCode : defaultLangCode}`)
        }

    }

    // request handler to become an author
    const handleBecomeAuthorReq = async () => {
        // Set local state to show bio and social media fields
        setPendingAuthorRequest(true)
        setProfileData(prevState => ({ ...prevState, bio: '', telegram: '', whatsapp: '', facebook: '', linkedin: '' }))
        toast.success(translate('fillBioAndSocialMsg'))
    }

    const renderAuthorStatus = (isAuthor, authorReviewStatus) => {
        if (isAuthor === 0 && authorReviewStatus === "0") {
            return (
                <div className='border text-sm text-[#017A80] font-normal  border-[#017A80] bg-[#E7FFFF] w-fit flex items-center justify-center gap-1 p-1 rounded'>
                    <IoMdInformationCircleOutline color='#017A80' size={22} />
                    {translate("pendingReview")}
                </div>
            )
        } else if (isAuthor === 1 && authorReviewStatus === "1") {
            return (
                <div className='w-fit text-[#060F72] py-1 px-4 bg-[#E7EEFF] flex items-center gap-1 border border-[#060F72] text-sm font-medium p-1 rounded mb-4'>
                    <MdOutlineVerified size={22} />
                    {translate("author")}
                </div>
            )
        } else {
            return (
                <button
                    type='button'
                    className='border border-[#1B2D51] rounded px-2 py-1 text-sm font-normal textPrimary'
                    onClick={handleBecomeAuthorReq}
                >
                    {translate("becomeAnAuthor")}
                </button>
            )
        }
    }

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('update-profile')} />

                <section className='updateProfile container mt-8 md:mt-12'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        <div className='flexCenter'>
                            <Image src={porfileSectImg} alt='update-profile' loading='lazy' height={0} width={0} className='h-auto w-auto' onError={placeholderImage} />
                        </div>

                        <div className='flex items-center justify-center'>
                            <div className="w-full p-6 border borderColor rounded-[16px] ">
                                <div className="flex flex-col items-center">
                                    {/* Profile Image */}
                                    <div className="flex self-start w-full border borderColor rounded-xl p-3">
                                        <div className="flex flex-wrap self-start justify-center gap-6">
                                            <div className="relative">
                                                <img
                                                    src={userData.data && userData.data.profile ? userData.data.profile : usersvg.src}
                                                    alt="Profile"
                                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                                                />
                                                {/* Camera Icon for Upload */}
                                                <label
                                                    htmlFor="profileImageInput"
                                                    className="absolute bottom-0 left-1/2  md:left-16 primaryBg h-8 w-8 flexCenter rounded-full p-1 text-white cursor-pointer"
                                                >
                                                    <FaCamera />
                                                </label>
                                            </div>
                                            {/* Hidden Input for File */}
                                            <input
                                                type="file"
                                                id="profileImageInput"
                                                accept="image/*;capture=camera"
                                                className="absolute opacity-0 w-0 h-0"
                                                onChange={handleImageChange}
                                            />
                                            <div className='flex flex-col items-center md:items-start gap-3'>
                                                <div className="flex flex-col items-center md:items-start gap-1">
                                                    <div className='textPrimary font-medium text-base'>{userData?.data?.name}</div>
                                                    <div className='font-normal textPrimary text-sm text-wrap'>{userData?.data?.email}</div>
                                                </div>
                                                {/* <button
                                                    type='button'
                                                    className='border border-[#1B2D51] rounded px-2 py-1 text-sm font-normal textPrimary'
                                                    onClick={() => { }}
                                                >
                                                    {translate("becomeAnAuthor")}
                                                </button> */}
                                                {renderAuthorStatus(profileData?.isAuthor, profileData?.authorReviewStatus)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="mt-8 flex flex-col gap-8 w-full">
                                        <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                            <label className="block text-[14px] font-[400]">{translate('your-name')}</label>
                                            <input
                                                type="text"
                                                name='name'
                                                id='name'
                                                className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                defaultValue={userName && userName ? userName : userData.data && userData.data?.name}
                                                onChange={e => handleChange(e)}
                                                required
                                            />
                                        </div>

                                        <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                            <label className="block text-[14px] font-[400]">{translate('emailLbl')}</label>
                                            {
                                                userData && userData.isMobileLogin ?
                                                    <input
                                                        type="email"
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                        defaultValue={userData.data && userData.data.email}
                                                        onChange={e => validateEmail(e)}
                                                    /> :
                                                    <input
                                                        type="email"
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none cursor-not-allowed"
                                                        placeholder={userData.data && userData.data.email}
                                                        readOnly
                                                    />
                                            }
                                        </div>
                                        <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                            <label className="block text-[14px] font-[400]">{translate('mobileLbl')}</label>
                                            {
                                                userData && userData.isMobileLogin ?
                                                    <input
                                                        type='number'
                                                        name='mobile'
                                                        id='mobile'
                                                        min='0'
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none cursor-not-allowed"
                                                        placeholder={userData.data && userData.data && userData.data.mobile}
                                                        readOnly
                                                    /> :
                                                    <input
                                                        type="number"
                                                        name='mobile'
                                                        id='mobile'
                                                        className="w-full font-[600] !bg-transparent text px-2 mt-2 focus:outline-none"
                                                        min='0'
                                                        max='12'
                                                        defaultValue={userData.data && userData.data.mobile}
                                                        onChange={e => validateNumber(e)}
                                                    />
                                            }
                                        </div>

                                        {(profileData?.isAuthor || pendingAuthorRequest) ?
                                            (
                                                <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                                    <label className="block text-[14px] font-[400]">{translate('bio')}</label>
                                                    <input
                                                        type='text'
                                                        name='bio'
                                                        id='bio'
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                        placeholder={translate("addYourBio")}
                                                        value={profileData?.bio}
                                                        onChange={e => handleChange(e)}
                                                    />

                                                </div>
                                            ) : null}
                                    </div>
                                    {(profileData?.isAuthor || pendingAuthorRequest) ?
                                        (
                                            <div className='w-full flex flex-col gap-8 mt-8'>

                                                <div className="flex flex-col gap-3 justify-start">
                                                    <div className="text-base font-semibold textPrimary">{translate('socialMediaLinks')}</div>
                                                    <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                                        <label className="block text-[14px] font-[400]">{translate('telegram')}</label>
                                                        <input
                                                            type='url'
                                                            name='telegram'
                                                            id='telegram'
                                                            className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                            placeholder={translate("addLinkHere")}
                                                            value={profileData?.telegram}
                                                            onChange={e => handleChange(e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                                    <label className="block text-[14px] font-[400]">{translate('whatsapp')}</label>
                                                    <input
                                                        type='url'
                                                        name='whatsapp'
                                                        id='whatsapp'
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                        placeholder={translate("addLinkHere")}
                                                        value={profileData?.whatsapp}
                                                        onChange={e => handleChange(e)}
                                                    />

                                                </div>
                                                <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                                    <label className="block text-[14px] font-[400]">{translate('facebook')}</label>
                                                    <input
                                                        type='url'
                                                        name='facebook'
                                                        id='facebook'
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                        placeholder={translate("addLinkHere")}
                                                        value={profileData?.facebook}
                                                        onChange={e => handleChange(e)}
                                                    />

                                                </div>
                                                <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                                    <label className="block text-[14px] font-[400]">{translate('linkedin')}</label>
                                                    <input
                                                        type='url'
                                                        name='linkedin'
                                                        id='linkedin'
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                        placeholder={translate("addLinkHere")}
                                                        value={profileData?.linkedin}
                                                        onChange={e => handleChange(e)}
                                                    />

                                                </div>


                                            </div>
                                        ) : null}
                                    <button className='commonBtn m-auto w-full text-[18px] !py-3 mt-8' onClick={e => formDetails(e)}> {translate('update-profile')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        </Layout>
    )
}

export default ProfileUpdate