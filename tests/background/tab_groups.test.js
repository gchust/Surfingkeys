import { organizeTabGroups, selectTabGroup } from 'src/background/tab_groups.js';

describe('tab group switching', () => {
    const tabs = [
        {id: 11, groupId: 1, index: 1, title: 'one'},
        {id: 12, groupId: 1, index: 2, title: 'two'},
        {id: 21, groupId: 2, index: 4, title: 'three'},
        {id: 31, groupId: -1, index: 3, title: 'ungrouped'}
    ];
    const groups = organizeTabGroups(
        [{id: 2, title: 'Second'}, {id: 1, title: 'First'}, {id: 3, title: 'Empty'}],
        tabs,
        12,
        -1
    );

    test('orders groups by their first tab and marks the active group', () => {
        expect(groups.map((group) => group.id)).toEqual([1, 2]);
        expect(groups[0].active).toBe(true);
        expect(groups[1].active).toBe(false);
    });

    test('switches to the next group and restores its last active tab', () => {
        const target = selectTabGroup(groups, tabs[0], 'next', undefined, [21, 11]);
        expect(target.group.id).toBe(2);
        expect(target.tab.id).toBe(21);
    });

    test('wraps when switching to the previous group', () => {
        const target = selectTabGroup(groups, tabs[0], 'previous', undefined, []);
        expect(target.group.id).toBe(2);
    });

    test('selects the nearest group from an ungrouped tab', () => {
        expect(selectTabGroup(groups, tabs[3], 'next', undefined, []).group.id).toBe(2);
        expect(selectTabGroup(groups, tabs[3], 'previous', undefined, []).group.id).toBe(1);
    });

    test('selects a group directly', () => {
        const target = selectTabGroup(groups, tabs[0], undefined, 1, [11, 12]);
        expect(target.tab.id).toBe(12);
    });
});
