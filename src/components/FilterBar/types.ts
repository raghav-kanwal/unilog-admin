export type FieldType = 'multi_select'

export type CustomFieldProps = {
    _key: string
    default_value: string[]
    hidden: Boolean
    type: FieldType
    display_name: string
}

export type CustomFieldValues = { type: 'multi_select', _key: string, value: string[]} | { type: 'text', _key: string, value: string } 