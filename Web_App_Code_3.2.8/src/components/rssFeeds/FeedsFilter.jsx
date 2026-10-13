'use client'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { categoriesSelector, categoryLimit, totalCates } from '../store/reducers/CategoriesReducer';
import { setCateOffset } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { getRssFeedsApi } from '@/utils/api/api'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IoClose, IoFilter } from 'react-icons/io5';
import TabsContent from './TabsContent';
import toast from 'react-hot-toast';
import { rssFeedViewAllCateIds, setRssFeedViewCategoryState } from '../store/reducers/helperReducer';

const FeedsFilter = ({
    selectedFilters,
    setSelectedFilters,
    setOffset,
    setLoadMore
}) => {

    const currentLanguage = useSelector(currentLanguageSelector)
    const settingsData = useSelector(settingsSelector)
    const categories = useSelector(categoriesSelector);
    const cateLimit = useSelector(categoryLimit);
    const totalCategories = useSelector(totalCates);
    const rssFeedViewAllCateIdsData = useSelector(rssFeedViewAllCateIds);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false)

    // Feeds API state
    const feedsDataperPage = 10;
    const [feeds, setFeeds] = useState([]);
    const [feedsLoadMore, setFeedsLoadMore] = useState(false)
    const [feedsOffset, setFeedsOffset] = useState(0)
    const [feedsTotalData, setFeedsTotalData] = useState('')

    const handleFeedsLoadMore = () => {
        setFeedsLoadMore(true)
        setFeedsOffset(feedsOffset + 1)
    }

    // Feeds API call
    const getRssFeeds = async () => {
        try {
            const { data } = await getRssFeedsApi.getRssFeeds({ language_code: currentLanguage?.code, offset: feedsOffset * feedsDataperPage, limit: feedsDataperPage })

            if (!data?.error) {
                if (feedsLoadMore) {
                    setFeeds((prevData) => [...prevData, ...data?.data?.data]);
                }
                else {
                    setFeeds(data?.data?.data)
                }
                setFeedsTotalData(data?.data?.total)
            }
            else {
                setFeeds([])
                console.log('error =>', data?.message)
            }
        } catch (error) {
            console.log(error)
            setFeeds([])
        }
    }

    useEffect(() => {
        if (currentLanguage?.code) {
            getRssFeeds()
        }
    }, [currentLanguage, feedsOffset]);

    // Tab state
    const [activeTab, setActiveTab] = useState(settingsData && settingsData?.data?.category_mode === '1' ? 0 : 1)

    // Selection state for each tab (local to the filter modal)
    const [selectedCategories, setSelectedCategories] = useState({})
    const [selectedCategoryIds, setSelectedCategoryIds] = useState('')

    const [selectedSubCategories, setSelectedSubCategories] = useState({})
    const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState('')

    const [selectedFeeds, setSelectedFeeds] = useState({})
    const [selectedFeedIdsLocal, setSelectedFeedIdsLocal] = useState('')

    // Get subcategories from ALL locally selected categories in the modal
    const localSelectedCatIds = Object.keys(selectedCategories).filter(key => selectedCategories[key])
    const subCategories = localSelectedCatIds.flatMap(catId => {
        const catObj = categories.find(cate => String(cate.id) === String(catId))
        return catObj?.sub_categories || []
    })

    useEffect(() => {
        if (rssFeedViewAllCateIdsData) {
            setSelectedCategoryIds(rssFeedViewAllCateIdsData)
            // Build the selectedCategories object so TabsContent shows checkmarks
            const ids = String(rssFeedViewAllCateIdsData).split(',').map(id => id.trim()).filter(Boolean)
            const categoriesObj = ids.reduce((acc, id) => {
                acc[id] = true
                return acc
            }, {})
            setSelectedCategories(categoriesObj)
            applyFilter()
        }
    }, [rssFeedViewAllCateIdsData])


    useEffect(() => {
        // console.log("subCategories", subCategories)
    }, [subCategories])

    // Handle closing the dialog when clicking outside
    const handleOpenChange = (open) => {
        setModalOpen(open);
    };


    const filterTabs = [
        {
            id: 0,
            tab: translate('catLbl')
        },
        {
            id: 1,
            tab: translate('subcatLbl')
        },
        {
            id: 2,
            tab: translate('feeds')
        },
    ];

    const clearFilter = () => {
        setSelectedCategories({})
        setSelectedCategoryIds('')
        setSelectedSubCategories({})
        setSelectedSubCategoryIds('')
        setSelectedFeeds({})
        setSelectedFeedIdsLocal('')
        setRssFeedViewCategoryState({ data: null })
    }

    const applyFilter = (type) => {
        setOffset(1)
        setLoadMore(false)
        if (type === 'clear') {
            clearFilter()
            // Also clear parent state
            setSelectedFilters({
                cateIds: [],
                subCateIds: [],
                feedsIds: [],
            })
            setModalOpen(false)
        }
        if (type === 'apply') {
            // Get selected category IDs
            const selectedCatIds = Object.keys(selectedCategories).filter(key => selectedCategories[key]).map(Number)

            // Get selected subcategory IDs
            const selectedSubCatIds = Object.keys(selectedSubCategories).filter(key => selectedSubCategories[key]).map(Number)

            // Get selected feed IDs
            const selectedFeedIdsList = Object.keys(selectedFeeds).filter(key => selectedFeeds[key]).map(Number)

            if (selectedCatIds.length > 0 || selectedSubCatIds.length > 0 || selectedFeedIdsList.length > 0) {
                setSelectedFilters({
                    cateIds: selectedCatIds,
                    subCateIds: selectedSubCatIds,
                    feedsIds: selectedFeedIdsList,
                })
                setModalOpen(false)
            } else {
                toast.error(translate('pleaseApplyFilter'))
            }
        }
    }

    const isFilters = selectedFilters.cateIds.length > 0 || selectedFilters.subCateIds.length > 0 || selectedFilters.feedsIds.length > 0;

    return (
        <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild onClick={() => setModalOpen(true)}>
                <button className={`text-[#1B2D51] dark:text-white font-semibold md:text-lg border borderColor rounded-[8px] p-2 flexCenter gap-4 h-[40px] sm:h-auto relative ${isFilters ? 'after:absolute after:top-0 after:right-0 after:primaryBg after:h-1.5 after:w-1.5 after:rounded-full' : ''}`}>
                    <span className=''>{translate('filter')}</span>
                    <IoFilter />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] md:max-w-[70%] 2xl:max-w-[50%] max-h-fit bg-white commonRadius p-0 border-none searchModalWrapper overflow-hidden overflow-x-auto">
                <div className='flex flex-col p-3 md:p-6 gap-6'>
                    <DialogHeader className={'border-b pb-3'}>
                        <div className='flex items-center justify-between'>
                            <DialogTitle className='text-[#1B2D51]'>{translate('filter')}</DialogTitle>

                            <button className='bg-transparent border borderColor w-[44px] h-[40px] flexCenter commonRadius primaryColor focus:outline-none' onClick={() => setModalOpen(false)}><IoClose size={24} /></button>

                        </div>
                    </DialogHeader>

                    {
                        modalOpen &&
                        <div className='flex flex-col gap-6 max-h-[600px] lg:max-h-[700px] overflow-y-auto customScrollBar'>
                            <div>
                                <div className='bg-[#1B2D511A] commonRadius p-2 max-[1199px]:w-max w-[550px] h-[50px] flex items-center justify-between max-[1199px]:justify-center gap-3'>
                                    {
                                        filterTabs?.map((ele, index) => {
                                            return <span key={index} className={`cursor-pointer h-[35px] w-max px-2 lg:w-[154px] font-medium rounded flexCenter ${activeTab === index ? 'bg-[#1B2D51] text-white' : 'text-[#1B2D51]'} ${index === 0 && settingsData && settingsData?.data?.category_mode !== '1' ? '!hidden' : ''}`}
                                                onClick={() => setActiveTab(index)}
                                            >
                                                {ele.tab}
                                            </span>
                                        })
                                    }
                                </div>
                            </div>

                            <div>
                                {/* Category Tab */}
                                {
                                    activeTab === 0 && settingsData && settingsData?.data?.category_mode === '1' &&
                                    <TabsContent
                                        data={categories || []}
                                        selectedIds={selectedCategoryIds}
                                        setSelectedIds={setSelectedCategoryIds}
                                        selectedItems={selectedCategories}
                                        setSelectedItems={setSelectedCategories}
                                        labelKey='category_name'
                                        idKey='id'
                                        showLoadMore={totalCategories > cateLimit && totalCategories !== categories?.length}
                                        onLoadMore={() => setCateOffset(1)}
                                    />
                                }
                                {/* Subcategory Tab */}
                                {
                                    activeTab === 1 && settingsData && settingsData?.data?.subcategory_mode === '1' &&
                                    <>
                                        {localSelectedCatIds.length > 0 ?
                                            <TabsContent
                                                data={subCategories || []}
                                                selectedIds={selectedSubCategoryIds}
                                                setSelectedIds={setSelectedSubCategoryIds}
                                                selectedItems={selectedSubCategories}
                                                setSelectedItems={setSelectedSubCategories}
                                                labelKey='subcategory_name'
                                                idKey='id'
                                            />
                                            :
                                            <div className="bg-white rounded-[8px] border borderColor p-2 sm:p-4 h-[300px] overflow-y-auto flexCenter dark:text-black">
                                                {translate('plzSelCatLbl')}
                                            </div>}
                                    </>
                                }
                                {/* Feeds Tab */}
                                {
                                    activeTab === 2 &&
                                    <TabsContent
                                        data={feeds || []}
                                        selectedIds={selectedFeedIdsLocal}
                                        setSelectedIds={setSelectedFeedIdsLocal}
                                        selectedItems={selectedFeeds}
                                        setSelectedItems={setSelectedFeeds}
                                        labelKey='feed_name'
                                        idKey='id'
                                        showLoadMore={feedsTotalData > feedsDataperPage && feedsTotalData !== feeds?.length}
                                        onLoadMore={handleFeedsLoadMore}
                                    />
                                }
                            </div>

                            <div className='flexCenter !justify-end gap-3'>
                                <button className='!font-medium !h-[40px] max-[360px]:w-max w-[145px] p-[6px_12px] bg-transparent text-[#1B2D51] dark:text-black border borderColor rounded-[8px]' onClick={() => applyFilter('clear')}>{translate('clear')}</button>
                                <button className='!font-medium !h-[40px] max-[360px]:w-max w-[145px] commonBtn !rounded-[8px]' onClick={() => applyFilter('apply')}>{translate('apply')}</button>
                            </div>

                        </div>
                    }

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FeedsFilter