// AI-assisted - see AI-USAGE.md #<2>

import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import MultiSelect from './MultiSelect'

function MultiSelectHarness() {
    const [selected, setSelected] = useState([])

    return (
        <MultiSelect
            label="Type"
            options={['Fire', 'Water', 'Grass']}
            selected={selected}
            onChange={setSelected}
        />
    )
}

describe('MultiSelect', () => {
    test('toggles options and updates the summary', async () => {
        const user = userEvent.setup()

        render(<MultiSelectHarness />)

        // When the component is rendered, the all button is displayed
        expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()

        /* When clicking the dropdown button (currently displaying "All") and
        then selecting the "Fire" checkbox, the dropdown button displays "Fire" */

        await user.click(screen.getByRole('button', { name: 'All' }))
        await user.click(screen.getByRole('checkbox', { name: 'Fire' }))
        expect(screen.getByRole('button', { name: 'Fire' })).toBeInTheDocument()

        /* When clicking the dropdown button (currently displaying "Fire") and
        then selecting the "Water" checkbox, the dropdown button displays "2 selected" */
        await user.click(screen.getByRole('checkbox', { name: 'Water' }))
        expect(screen.getByRole('button', { name: '2 selected' })).toBeInTheDocument()

        /* When clicking the dropdown button (currently displaying "2 selected" for Fire and
        Water) and then de-selecting the "Fire" checkbox, the dropdown button displays "Water" */
        await user.click(screen.getByRole('checkbox', { name: 'Fire' }))
        expect(screen.getByRole('button', { name: 'Water' })).toBeInTheDocument()
    })
})
