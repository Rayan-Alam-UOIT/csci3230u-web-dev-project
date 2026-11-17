// AI-assisted - see AI-USAGE.md #<2>

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
    test('moves between pages and ignores controls past either end', async () => {
        const user = userEvent.setup()
        const onPageChange = vi.fn()

        // 1 Page displays no pagination
        const { rerender } = render(
            <Pagination key={1} page={1} totalPages={1} onPageChange={onPageChange} />
        )
        expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()

        // When 3 pages & on first page, the first page has attribute "aria-current"
        rerender(<Pagination key={1} page={1} totalPages={3} onPageChange={onPageChange} />)

        expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')

        // When 3 pages & on first page, the previous control is disabled and does not change the page
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
        expect(onPageChange).not.toHaveBeenCalled()

        // When 3 pages & on first page, pressing the next page button calls onPageChange with 2
        await user.click(screen.getByRole('button', { name: 'Next page' }))
        expect(onPageChange).toHaveBeenCalledWith(2)

        // When 3 pages & on last page (3rd), the last page has attribute "aria-current"
        onPageChange.mockClear()
        rerender(<Pagination key={3} page={3} totalPages={3} onPageChange={onPageChange} />)

        expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')

        // When 3 pages & on last page (3rd), the next control is disabled and does not change the page
        expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
        expect(onPageChange).not.toHaveBeenCalled()

        /* When 3 pages & on last page (3rd), pressing the previous page button
        calls onPageChange with 2 */
        await user.click(screen.getByRole('button', { name: 'Previous page' }))
        expect(onPageChange).toHaveBeenCalledWith(2)
    })
})
