import { Dispatch, SetStateAction } from 'react'
import { CustomFieldProps, CustomFieldValues, FieldType } from '../FilterBar/types'
import MultiSelect from './MultiSelect/MultiSelect'

interface Props extends CustomFieldProps {
    setValues: Dispatch<SetStateAction<CustomFieldValues[]>>
}

export default function Field(props: Props) {
    switch (props.type) {
        case 'multi_select':
            return <MultiSelect {...props} setValues={props.setValues} />
        default:
            return <></>
    }
}
