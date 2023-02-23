import { Menu, MenuButton, Flex, MenuList, MenuItem, Checkbox, Text } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai'
import { CustomFieldProps, CustomFieldValues } from '../../FilterBar/types'
import styles from "./MultiSelect.module.scss"

interface Props extends CustomFieldProps {
    values: CustomFieldValues[],
    setValues: Dispatch<SetStateAction<CustomFieldValues[]>>
}

export default function MultiSelect({ _key, default_value, values, setValues }: Props) {
    const [options, setOptions] = useState<string[]>(values.find(v => v.type === 'multi_select' && v._key === _key)?.value as string[] || []);

    useEffect(() => {
        setValues((values) => {
            const field = values.find(v => v._key === _key);
            field ? field.value = options : values.push({ _key, type: 'multi_select', value: options});
            return [...values];
        })
    }, [options])

    const onCheckboxChange = (ev: any, key: string) => {
        if (ev.target.checked) setOptions((options) => [...options, key]);
        else setOptions((options) => options.filter(o => o !== key));
    }
    
    return (
        <Menu autoSelect={false} closeOnSelect={false}>
            <MenuButton background="white" fontSize="sm">
                <Flex align="center" justifyContent="space-between" fontWeight="normal" className={styles.filterByButton}>
                    {!!options.length ? `${options.length} Selected` : <Text as="span">Select options</Text> }
                    <AiFillCaretDown fontSize="14px" />
                </Flex>
            </MenuButton>
            <MenuList>
                {
                    default_value ?
                        default_value.filter(Boolean).map((v: string) =>
                            <MenuItem key={v}>
                                <Checkbox isChecked={options.includes(v)} onChange={($event) => onCheckboxChange($event, v)}>{v}</Checkbox>
                            </MenuItem>
                        )
                        : <></>
                }
            </MenuList>
        </Menu>
    )
}
