function organizeTabGroups(groups, tabs, activeTabId, noneGroupId) {
    const tabsInGroup = {};
    tabs.forEach(function(tab) {
        if (tab.groupId !== undefined && tab.groupId !== noneGroupId) {
            if (!tabsInGroup[tab.groupId]) {
                tabsInGroup[tab.groupId] = [];
            }
            tabsInGroup[tab.groupId].push(tab);
        }
    });

    return groups.filter((group) => !group.hermit && tabsInGroup[group.id]?.length)
        .map(function(group) {
            const groupTabs = tabsInGroup[group.id].sort((a, b) => a.index - b.index);
            return Object.assign({}, group, {
                tabs: groupTabs,
                active: groupTabs.some((tab) => tab.id === activeTabId),
                firstIndex: groupTabs[0].index
            });
        })
        .sort((a, b) => a.firstIndex - b.firstIndex);
}

function selectTabGroup(groups, currentTab, direction, groupId, tabHistory) {
    if (!groups.length) {
        return null;
    }

    let targetGroup;
    if (groupId !== undefined) {
        targetGroup = groups.find((group) => group.id === groupId);
    } else {
        const currentGroupIndex = groups.findIndex((group) => group.id === currentTab.groupId);
        if (currentGroupIndex >= 0) {
            const offset = direction === "previous" ? -1 : 1;
            targetGroup = groups[(currentGroupIndex + offset + groups.length) % groups.length];
        } else if (direction === "previous") {
            targetGroup = groups.slice().reverse().find((group) => group.firstIndex < currentTab.index) || groups[groups.length - 1];
        } else {
            targetGroup = groups.find((group) => group.firstIndex > currentTab.index) || groups[0];
        }
    }

    if (!targetGroup) {
        return null;
    }

    const targetTabIds = new Set(targetGroup.tabs.map((tab) => tab.id));
    const lastActiveTabId = tabHistory.slice().reverse().find((tabId) => targetTabIds.has(tabId));
    return {
        group: targetGroup,
        tab: targetGroup.tabs.find((tab) => tab.id === lastActiveTabId) || targetGroup.tabs[0]
    };
}

export {
    organizeTabGroups,
    selectTabGroup
};
