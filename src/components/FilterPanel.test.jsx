// AI-assisted - see AI-USAGE.md #<2>

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import FilterPanel from './FilterPanel'

function filters(overrides = {}) {
    return {
        selectedGenerations: [],
        setSelectedGenerations: vi.fn(),
        selectedTypes: [],
        setSelectedTypes: vi.fn(),
        selectedCategories: [],
        setSelectedCategories: vi.fn(),
        sort: '',
        setSort: vi.fn(),
        hasActiveFilters: false,
        resetFilters: vi.fn(),
        ...overrides,
    }
}

describe('FilterPanel', () => {
    test('shows clear filters only while filters are active', async () => {
        const user = userEvent.setup()
        const resetFilters = vi.fn()

        // When no filters are active, the clear filters button is not displayed
        const { rerender } = render(<FilterPanel filters={filters()} />)
        expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()

        /* When filters are active, the clear filters button is visible, clickable, 
        and calls resetFilters */
        rerender(
            <FilterPanel filters={filters({ hasActiveFilters: true, resetFilters })} />
        )

        await user.click(screen.getByRole('button', { name: /clear filters/i }))
        expect(resetFilters).toHaveBeenCalledOnce()
    })
})
