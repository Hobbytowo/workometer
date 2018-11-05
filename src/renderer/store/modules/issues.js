import Vue from 'vue'
import service from '@/service'
import deburr from 'lodash.deburr'

const state = {
  issuesForSprint: {},
  issuesForBoard: {}
}

const addSearchableField = issue => ({
  ...issue,
  searchableField: deburr(issue.fields.summary + issue.key).toLowerCase()
})

const mutations = {
  setIssuesForBoard (state, payload) {
    const issues = payload.issues.map(addSearchableField)
    Vue.set(state.issuesForBoard, payload.id, issues)
  },
  setIssuesForSprint (state, payload) {
    const issues = payload.issues.map(addSearchableField)
    Vue.set(state.issuesForSprint, payload.id, issues)
  },
  updateIssue (state, { oldIssue, newIssue }) {
    /* This is a state mutation! */
    Object.assign(oldIssue, newIssue)
  },
  clearIssues (state) {
    state.issuesForBoard = {}
    state.issuesForSprint = {}
  }
}

const getters = {
  getIssues (state, getters, rootState) {
    const issues = rootState.sprints.selectedSprintId
      ? state.issuesForSprint[rootState.sprints.selectedSprintId]
      : state.issuesForBoard[rootState.boards.selectedBoardId]
    return issues || []
  }
}

const actions = {
  async fetchIssuesForBoard ({ commit, dispatch }, id) {
    dispatch('wait/start', 'issuesLoading', { root: true })
    const issues = await service.getIssuesForBacklog(id)
    commit('setIssuesForBoard', { id, issues })
    dispatch('wait/end', 'issuesLoading', { root: true })
  },
  async fetchIssuesForSprint ({ commit, dispatch }, id) {
    dispatch('wait/start', 'issuesLoading', { root: true })
    const issues = await service.getIssuesForSprint(id)
    commit('setIssuesForSprint', { id, issues })
    dispatch('wait/end', 'issuesLoading', { root: true })
  },
  async setIssueStatus ({ commit, dispatch }, { issue, status }) {
    dispatch('wait/start', `issueStatusChange_${issue.id}`, { root: true })
    await service.setIssueStatus(issue.id, status.name)
    const updatedIssue = await service.getIssue({ issueId: issue.id })
    commit('updateIssue', { oldIssue: issue, newIssue: updatedIssue })
    dispatch('wait/end', `issueStatusChange_${issue.id}`, { root: true })
  },
  async assignIssueToMe ({ commit, dispatch, rootGetters, rootState }, { issue }) {
    dispatch('wait/start', `issueAssignChange_${issue.id}`, { root: true })
    const assignee = rootState.login.userDetails.name
    await service.setIssueAssign({ issueId: issue.id, assignee })
    const updatedIssue = await service.getIssue({ issueId: issue.id })
    commit('updateIssue', { oldIssue: issue, newIssue: updatedIssue })
    dispatch('wait/end', `issueAssignChange_${issue.id}`, { root: true })
  },
  async refreshIssues ({ dispatch, rootState }) {
    dispatch('wait/start', 'issueRefreshing', { root: true })
    const selectedSprintId = rootState.sprints.selectedSprintId
    const selectedBoardId = rootState.boards.selectedBoardId
    await dispatch('fetchIssuesForSprint', selectedSprintId)
    await dispatch('fetchIssuesForBoard', selectedBoardId)
    await dispatch('sprints/fetchSprints', selectedBoardId, { root: true })
    dispatch('wait/end', 'issueRefreshing', { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
