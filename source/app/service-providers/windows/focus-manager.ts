/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        FocusManager
 * CVM-Role:        <none>
 * Maintainer:      Patrik Andersson
 * License:         GNU GPL v3
 *
 * Description:     This file contains a dummy FocusManager, to simplify the
 *                  focus-management in the WindowProvider.
 *
 *
 * END HEADER
 */

interface Focus {
  windowId: string
  leafId: string|undefined
}

class FocusManager {
  private readonly _order: string[]

  constructor () {
    this._order = []
  }

  getFocus (): string {
    return this._order[0]
  }

  getOrder (): string[] {
    return this._order
  }

  /**
   * Update the focus order such that select focus is first in the
   * array.
   *
   * @param   {string}  key  windowId to be sorted first
   */
  setFocus (key: string): void {
    const index = this._order.indexOf(key)
    if (index > -1) {
      this._order.splice(index, 1)
    }
    this._order.splice(0, 0, key)
  }

  /**
   * Remove a key from the focus ordering, eg when a window is closed.
   *
   * @param   {string}  key  windowId to be removed
   */
  deleteFocus (key: string): void {
    const index = this._order.indexOf(key)
    if (index > -1) {
      this._order.splice(index, 1)
    }
  }
}

export class TreeFocusManager {
  private readonly _windowsFocus: FocusManager
  private readonly _leafFocus: Map<string, FocusManager>

  constructor () {
    this._windowsFocus = new FocusManager()
    this._leafFocus = new Map()
  }

  getWindowsOrder (): string[] {
    return this._windowsFocus.getOrder()
  }

  /**
   * Return the current focus
   *
   * @return  {Focus}
   *  object containing the last focused windowId and leafid
   */
  getFocus (): Focus {
    const winId = this._windowsFocus.getFocus()

    return {
      windowId: this._windowsFocus.getFocus(),
      leafId: this._leafFocus.get(winId)?.getFocus()
    }
  }

  /**
   * Set the current window and leaf which are in focus
   *
   * @param   {string}  windowId  the current window
   * @param   {string}  leafId    the current leaf
   */
  setFocus (windowId: string, leafId?: string): void {
    this._windowsFocus.setFocus(windowId)
    if (leafId === undefined) {
      return
    }

    let leafFocus = this._leafFocus.get(windowId)

    if (leafFocus === undefined) {
      leafFocus = new FocusManager()
      this._leafFocus.set(windowId, leafFocus)
    }
    leafFocus.setFocus(leafId)
  }

  /**
   * Delete a window and its leaf from focus tracking.
   *
   * @param   {string}  windowId  the window to be removed
   */
  deleteWindow (windowId: string): void {
    this._windowsFocus.deleteFocus(windowId)
    this._leafFocus.delete(windowId)
  }

  /**
   * Remove a leaf from the focus-tracking
   *
   * @param   {string}  key     windowId to be removed
   * @param   {string}  leafId  leafId to remove
   */
  deleteLeaf (windowId: string, leafId: string): void {
    const leafFocus = this._leafFocus.get(windowId)
    if (leafFocus !== undefined) {
      leafFocus.deleteFocus(leafId)
    }
  }
}
