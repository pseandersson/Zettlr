/* eslint-disable no-undef */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        FocusManager tests
 * CVM-Role:        TESTING
 * Maintainer:      Patrik Andersson
 * License:         GNU GPL v3
 *
 * Description:     This file tests a component of Zettlr.
 *
 * END HEADER
 */

import { strictEqual, deepStrictEqual } from 'assert'

import { TreeFocusManager } from '../source/app/service-providers/windows/focus-manager'

describe('FocusManager', function () {
  it('should return undefined values if no focus has been set', async function () {
    const focusManager = new TreeFocusManager()
    const focus = focusManager.getFocus()

    strictEqual(focus.windowId, undefined, 'There should not be an initial value to windowId')
    strictEqual(focus.leafId, undefined, 'There should not be an initial value to leafId')
  })

  it('should return undefined leafId if there exists no leaf', async function () {
    const focusManager = new TreeFocusManager()
    focusManager.setFocus('window')
    const focus = focusManager.getFocus()

    strictEqual(focus.windowId, 'window', 'WindowId was not registered')
    strictEqual(focus.leafId, undefined, 'There should not be an initial value to leafId')
  })

  it('should keep track on windows order', async function () {
    const focusManager = new TreeFocusManager()
    focusManager.setFocus('3')
    focusManager.setFocus('2')
    focusManager.setFocus('1')
    focusManager.setFocus('3')

    const focusOrder = focusManager.getWindowsOrder()
    deepStrictEqual(focusOrder, [ '3', '1', '2' ], 'The orders of the windows are incorrect')
  })

  it('should be able to remove windows', async function () {
    const focusManager = new TreeFocusManager()
    focusManager.setFocus('3')
    focusManager.setFocus('2')
    focusManager.setFocus('1')
    focusManager.deleteWindow('1')
    focusManager.deleteWindow('3')

    const focusOrder = focusManager.getWindowsOrder()
    deepStrictEqual(focusOrder, ['2'], 'Failed to remove windows')
  })

  it('should be able to track multiple windows and its leafs', async function () {
    const focusManager = new TreeFocusManager()
    focusManager.setFocus('1', 'A')
    focusManager.setFocus('2', 'B')
    focusManager.setFocus('1', 'C')
    focusManager.setFocus('2', 'D')

    let focus = focusManager.getFocus()
    strictEqual(focus.windowId, '2', 'Failed to track focus on windows')
    strictEqual(focus.leafId, 'D', 'Failed to track focus on leafs')

    focusManager.setFocus('1')
    focus = focusManager.getFocus()
    strictEqual(focus.windowId, '1', 'Failed to track focus on windows')
    strictEqual(focus.leafId, 'C', 'Failed to keep track of previous windows')
  })

  it('should be able to remove leaf from windows and remember previous leaf', async function () {
    const focusManager = new TreeFocusManager()
    focusManager.setFocus('1', 'A')
    focusManager.setFocus('1', 'B')
    focusManager.deleteLeaf('1', 'B')

    const focus = focusManager.getFocus()
    strictEqual(focus.windowId, '1', 'Test setup failed!')
    strictEqual(focus.leafId, 'A', 'Failed to remove leaf B')
  })
})
