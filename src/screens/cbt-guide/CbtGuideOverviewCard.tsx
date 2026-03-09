import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { CADDI_OVERVIEW, CADDI_SOURCES } from '../../config/caddi';
import { EvidenceBadge } from '../../components/ui/EvidenceBadge';
import { GlowCard } from '../../ui/cosmic';
import { getCbtGuideStyles } from './cbtGuideStyles';

interface Props {
  isCosmic: boolean;
  onOpenSource: (url: string) => void;
}

export const CbtGuideOverviewCard = ({ isCosmic, onOpenSource }: Props) => {
  const styles = getCbtGuideStyles(isCosmic);

  return (
    <GlowCard glow="soft" tone="raised" padding="md" style={styles.compactCard}>
      <View style={styles.compactHeaderRow}>
        <Text style={styles.compactTitle}>{CADDI_OVERVIEW.title}</Text>
        <EvidenceBadge tier="clinical" label={CADDI_OVERVIEW.badge} />
      </View>

      <Text style={styles.compactDescription}>
        {CADDI_OVERVIEW.description}
      </Text>

      <View style={styles.evidenceRow}>
        {CADDI_OVERVIEW.bullets.map((bullet) => (
          <Text key={bullet} style={styles.evidenceBullet}>
            • {bullet}
          </Text>
        ))}
      </View>

      <View style={styles.linksRow}>
        {CADDI_SOURCES.map((source) => (
          <Pressable
            key={source.id}
            onPress={() => onOpenSource(source.url)}
            style={(state) => [
              styles.linkButton,
              (state as { pressed: boolean; hovered?: boolean }).hovered &&
                styles.linkButtonHovered,
              state.pressed && styles.linkButtonPressed,
            ]}
          >
            <Text style={styles.linkButtonText}>{source.label}</Text>
            <EvidenceBadge
              tier={source.sourceType === 'rct' ? 'rct' : 'clinical'}
              style={styles.linkBadge}
            />
          </Pressable>
        ))}
      </View>
    </GlowCard>
  );
};
