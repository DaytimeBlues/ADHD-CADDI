import { StyleSheet } from 'react-native';
import { CosmicTokens } from '../theme/cosmicTokens';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EEF2FF',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: CosmicTokens.colors.semantic.primary,
    letterSpacing: 3,
    marginTop: -2,
  },
  backButton: {
    marginRight: 16,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#EEF2FF',
    fontSize: 24,
  },
  syncButton: {
    paddingHorizontal: 12,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(238, 242, 255, 0.5)',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  addTaskCard: {
    marginTop: 24,
    borderRadius: 16,
  },
  addTaskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
  },
  addTaskInput: {
    flex: 1,
    color: '#EEF2FF',
    fontSize: 16,
    paddingVertical: 8,
  },
  addTaskButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
    marginBottom: 8,
  },
  filterTab: {
    flex: 1,
  },
  taskCard: {
    marginTop: 12,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EEF2FF',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: 'rgba(238, 242, 255, 0.4)',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dueDate: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(238, 242, 255, 0.4)',
    marginLeft: 8,
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    color: 'rgba(238, 242, 255, 0.3)',
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EEF2FF',
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(238, 242, 255, 0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
});
