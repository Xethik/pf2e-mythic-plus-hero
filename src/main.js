Hooks.on("renderCharacterSheetPF2e", (app, html, data) => {
    // Restrict strictly to character sheets
    if (app.actor.type !== "character")
        return;
    // Cast to the concrete PF2e types for advanced API usage if needed
    const sheet = app;
    const actor = app.actor;
    // 1. Target the element at line 6 of header.hbs. 
    // In the PF2e character header, this is typically '.sheet-header .sheet-resources' 
    // or a direct section.header container.
    const headerResources = html.find(".sheet-header .sheet-resources, .char-header .resources").first();
    if (!headerResources.length) {
        // Fallback check to a broader header selector if the partial architecture shifts
        console.warn("MythicPlusHero | Target header resource element not found.");
        return;
    }
    // Guard clause to ensure we don't accidentally inject multiple instances during re-renders
    if (html.find(".my-custom-header-resource").length > 0)
        return;
    // 2. Build your custom component matching PF2e's native HTML structure
    // Using native system classes like 'resource' or 'container' ensures font styles sync up.
    const customValue = actor.getFlag("my-module", "customValue") ?? 0;
    const customResourceHtml = `
        <div class="resource my-custom-header-resource">
            <h4 class="box-title">Custom Resource</h4>
            <div class="container">
                <input type="number" 
                       name="flags.my-module.customValue" 
                       value="${customValue}" 
                       data-dtype="Number" 
                       placeholder="0" />
            </div>
        </div>
    `;
    // 3. Insert horizontally adjacent (using .after() to place it to the right within the grid/flex context)
    headerResources.after(customResourceHtml);
    // 4. Register changes on interaction
    _activateHeaderListeners(html, actor);
});
function _activateHeaderListeners(html, actor) {
    html.find(".my-custom-header-resource input").on("change", async (event) => {
        const input = event.currentTarget;
        const value = parseInt(input.value, 10) || 0;
        // This natively triggers a re-render of the sheet and updates the actor state
        await actor.setFlag("my-module", "customValue", value);
    });
}
export {};
//# sourceMappingURL=main.js.map