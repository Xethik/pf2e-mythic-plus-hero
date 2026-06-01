import { CharacterPF2e, CharacterSheetPF2e } from "@7h3laughingman/pf2e-types";

Hooks.on("renderCharacterSheetPF2e", (...args: any[]) => {
    const app = args[0] as CharacterSheetPF2e<CharacterPF2e>;
    const html = args[1] as JQuery;

    // Restrict strictly to character sheets
    if (app.actor.type !== "character") return;

    const actor = app.actor as CharacterPF2e;

    const headerResources = html.find(".sheet-header .sheet-resources, .char-header .dots").first();

    if (!headerResources.length) {
        console.warn("PF2e MythicPlusHero | Target header resource dots element not found.");
        return;
    }
    
    // early out if we don't have mythic points
    if (actor.system.resources.mythicPoints.max <= 0)
    {
        return;
    }

    const heroPoints = actor.system.resources.heroPoints;
    const resourceSlug = "hero-points";
    const heroPointResource = actor.getResource(resourceSlug);
    
    const localizedLabel = game.i18n.localize(heroPointResource.label);    
    const localizedTooltip = (game.i18n as any).format("PF2E.Actor.ResourceRatio", {
                value: heroPoints.value,
                max: heroPoints.max,
                resource: localizedLabel
            });
    
    let pipsHtml = "";
    for (let idx = 0; idx < heroPoints.max; idx++) {
        if (heroPoints.value > idx) {
            pipsHtml += `<i class="fa-solid fa-circle-h" data-index="${idx}"></i>`;
        } else {
            pipsHtml += `<i class="fa-regular fa-circle" data-index="${idx}"></i>`;
        }
    }

    const heroPointsHtml = `
        <div class="dots custom-hero-points">
            <span class="label">${localizedLabel}</span>
            <span
                class="pips"
                data-action="adjust-resource"
                data-resource="${resourceSlug}"
                data-tooltip="${localizedTooltip}"
            >
                ${pipsHtml}
            </span>
        </div>
    `;

    headerResources.append(heroPointsHtml);
    
    const listener = (event: Event) => {
        const current = heroPoints.value;
        const change = event.type == "click" ? 1 : -1;
        actor.updateResource(resourceSlug, current + change);
    }

    html.find(".custom-hero-points .pips i").on("click", listener);
    html.find(".custom-hero-points .pips i").on("contextmenu", listener);
});
