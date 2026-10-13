"use client"

import React, { useMemo, useState } from "react"
import { FaAngleDown, FaCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { translate } from "@/utils/translation"

const TagSelect = ({
    tagsData,
    defaultValue,
    handleTagChange,
    /**
     * Create a tag when user presses Enter and the tag doesn't exist.
     * Expected to return either:
     *  - { id, tag_name }  OR
     *  - a string tag name
     */
    onCreateTag,
    /**
     * Optional: bubble API errors to the parent if you want centralized handling
     */
    onCreateError,
    onLoadMore,
    hasMore
}) => {
    const [open, setOpen] = useState(false)
    const [selectedValues, setSelectedValues] = useState(defaultValue?.defaultTagName?.split(',') || [])
    const [selectedTagIds, setSelectedTagIds] = useState(defaultValue?.defaultTag ? defaultValue.defaultTag.split(',') : [])

    const [query, setQuery] = useState("")
    const [localCreatedTags, setLocalCreatedTags] = useState([]) // keeps newly created tags visible without needing parent refetch
    const [isCreating, setIsCreating] = useState(false)
    const [createError, setCreateError] = useState("")

    const allTags = useMemo(() => {
        // Put newly created tags first, then existing tags
        const list = [...(localCreatedTags || []), ...(tagsData || [])]
        const seen = new Set()
        return list.filter(t => {
            const name = (t?.tag_name || "").trim()
            if (!name) return false
            const key = name.toLowerCase()
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
    }, [tagsData, localCreatedTags])

    const normalize = (s) => (s || "").trim()
    const findExistingByName = (name) => {
        const key = normalize(name).toLowerCase()
        return allTags.find(t => normalize(t?.tag_name).toLowerCase() === key)
    }

    const handleMultiSelectChange = (value, tagId = null) => {
        let newValues, newIds

        if (selectedValues.includes(value)) {
            // Remove tag
            newValues = selectedValues.filter(v => v !== value)
            newIds = selectedTagIds.filter((_, idx) => selectedValues[idx] !== value)
        } else {
            // Add tag
            newValues = [...selectedValues, value]

            // If tagId not provided, find it from allTags
            if (!tagId) {
                const existingTag = findExistingByName(value)
                tagId = existingTag?.id
            }

            newIds = [...selectedTagIds, tagId].filter(Boolean)
        }

        setSelectedValues(newValues)
        setSelectedTagIds(newIds)
        handleTagChange(newValues, newIds)
    }

    const createAndSelectTag = async (rawName) => {
        const name = normalize(rawName)
        if (!name) return

        setCreateError("")

        // If it already exists locally, just select it
        const existing = findExistingByName(name)
        if (existing?.tag_name) {
            handleMultiSelectChange(existing.tag_name, existing.id)
            setQuery("")
            return
        }

        if (!onCreateTag) {
            setCreateError("Tag not found, and tag creation is not configured.")
            return
        }

        setIsCreating(true)
        try {
            const created = await onCreateTag(name)
            const createdName =
                typeof created === "string" ? created : (created?.tag_name || name)
            const createdId = created?.id || `local-${createdName}`

            // Add to local list so it appears in dropdown immediately
            setLocalCreatedTags(prev => [
                ...prev,
                { id: createdId, tag_name: createdName },
            ])

            // Select it with the ID
            handleMultiSelectChange(createdName, createdId)
            setQuery("")
        } catch (err) {
            // Graceful handling for "already exists" from API side (commonly 409)
            const status = err?.status ?? err?.response?.status
            const message =
                err?.message ??
                err?.response?.data?.message ??
                err?.response?.data?.error ??
                "Failed to create tag."

            if (status === 409 || /already exists/i.test(message)) {
                // Optionally auto-select the existing one if present in current list
                const maybeExisting = findExistingByName(name)
                if (maybeExisting?.tag_name) {
                    handleMultiSelectChange(maybeExisting.tag_name, maybeExisting.id)
                    setQuery("")
                }
                setCreateError(message)
            } else {
                setCreateError(message)
            }

            onCreateError?.(err)
        } finally {
            setIsCreating(false)
        }
    }

    const onInputKeyDown = (e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        if (isCreating) return
        createAndSelectTag(query)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="hover:!bg-white bg-white">
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between ${selectedValues.length > 0 ? 'text-black hover:text-black' : 'text-gray-400 !font-[500] hover:text-gray-400'}`}
                >
                    {selectedValues.length > 0 ? selectedValues.join(", ") : translate('tagLbl')}
                    <FaAngleDown className="!h-3 !w-3" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full max-w-full !min-w-full p-0">
                <Command className='w-full !min-w-full'>
                    <CommandInput
                        placeholder="Search tags..."
                        className="!min-w-full"
                        value={query}
                        onValueChange={(v) => {
                            setQuery(v)
                            if (createError) setCreateError("")
                        }}
                        onKeyDown={onInputKeyDown}
                        disabled={isCreating}
                    />

                    <CommandList onMouseLeave={() => setOpen(false)}>
                        <CommandEmpty>
                            <div className="py-2 text-sm text-muted-foreground">
                                {translate('noTagsFound')}
                                {normalize(query) ? (
                                    <div className="mt-1 text-red-500 font-semibold">
                                        {translate('press')} <span className="font-medium">{translate('enter')}</span> {translate('toCreate')} {normalize(query)}
                                        {isCreating ? ` ${translate('creating')}` : ""}
                                    </div>
                                ) : null}
                                {createError ? (
                                    <div className="mt-2 text-sm text-red-600">
                                        {createError}
                                    </div>
                                ) : null}
                            </div>
                        </CommandEmpty>

                        <CommandGroup>
                            {allTags?.map((elem) => (
                                <CommandItem
                                    key={elem?.id}
                                    value={elem?.tag_name}
                                    onSelect={() => handleMultiSelectChange(elem?.tag_name, elem?.id)}
                                >
                                    <FaCheck
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValues.includes(elem?.tag_name) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {elem?.tag_name}
                                </CommandItem>
                            ))}
                            {hasMore && (
                                <div className="p-2 text-center">
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => {
                                            onLoadMore?.()
                                        }}
                                    >
                                        {translate('loadMore')}
                                    </Button>
                                </div>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default TagSelect
