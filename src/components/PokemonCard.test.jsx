// AI-assisted - see AI-USAGE.md #<2>

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import PokemonCard from './PokemonCard'

const pikachu = {
    id: 25,
    name: 'pikachu',
    is_favourite: false,
    sprites: {
        other: {
            'official-artwork': { front_default: '/pikachu.png' },
        },
    },
}

describe('PokemonCard', () => {
    test('links to the detail page and toggles the favourite with the pokemon id', async () => {
        const user = userEvent.setup()
        const onToggleFavourite = vi.fn()


        render(
            <MemoryRouter>
                <PokemonCard pokemon={pikachu} onToggleFavourite={onToggleFavourite} />
            </MemoryRouter>
        )

        // When the card is rendered, there are two links
        const links = screen.getAllByRole('link')
        expect(links).toHaveLength(2)
        // Each link has the correct href
        for (const link of links) {
            expect(link).toHaveAttribute('href', '/pokemon/25')
        }

        // When the favourite checkbox is clicked, onToggleFavourite is called with the pokemon id
        await user.click(screen.getByRole('checkbox', { name: 'Favourite Pikachu' }))
        expect(onToggleFavourite).toHaveBeenCalledWith(25)
    })
})
