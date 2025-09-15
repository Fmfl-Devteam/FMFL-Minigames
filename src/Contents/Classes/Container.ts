import { APIContainerComponent, ContainerBuilder, SeparatorSpacingSize } from 'discord.js'

export default class Container extends ContainerBuilder {
    public constructor({ components, ...data }: Partial<APIContainerComponent> = {}) {
        super({ components, ...data })
    }

    public build(): APIContainerComponent {
        this.addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Large))
        this.addTextDisplayComponents((text) =>
            text.setContent(
                'Powered by Fmfl Devteam [Discord](<https://discord.fmfl-devteam.de>) [Website](<https://fmfl-devteam.de>)'
            )
        )
        return this.toJSON()
    }
}
